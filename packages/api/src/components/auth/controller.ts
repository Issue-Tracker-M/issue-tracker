import { EMAIL_SECRET } from "../../config";
import { RequestHandler } from "express";
import generateToken from "../../utils/generateToken";
import bcrypt from "bcrypt";
import sendMail from "../../utils/sendEmail";
import { validateToken } from "../../utils/validateToken";
import ConfirmationToken from "./models/ConfirmationToken";
import RefreshToken from "./models/RefreshToken";
import PasswordResetToken from "./models/PasswordResetToken";
import resetPasswordTemplate from "../../templates/resetPasswordTemplate";
import User, { UserDocument } from "../users/model";
import InvitationToken, {
  InvitationTokenPopulatedDocument,
} from "./models/InvitationToken";
import { JSONify } from "../../utils/typeUtils";

const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
};

/**
 * Data expected for initial registration
 */
export type registerInput = Pick<
  UserDocument,
  "first_name" | "last_name" | "password" | "email" | "is_verified"
>;

/**
 * Creates a new user and sends an email confirmation letter.
 */
export const register: RequestHandler<unknown, unknown, registerInput> = async (
  req,
  res,
  next
): Promise<unknown> => {
  try {
    const { first_name, last_name, password, email } = req.body;
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
    });
    // generate and send email confirmation stuff
    await user.sendEmailConfirm();

    // Set refresh_token as an http-only cookie
    const refresh_token = await user.generateRefreshToken();
    res.cookie("refresh_token", refresh_token, cookieOptions);

    // generate access token and send back the response
    const access_token = user.generateAccessToken();
    return res.status(200).json({ token: access_token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Expected input for the regular login endpoint without Oauth.
 */
export type loginInput = Pick<UserDocument, "email" | "password">;

/**
 * Checks the validity of given credentials and issues a JWT.
 */
export const login: RequestHandler<unknown, unknown, loginInput> = async (
  req,
  res,
  next
) => {
  const { user } = req;
  try {
    if (!user) throw new Error("Missing user data");

    if (!(await user.comparePassword(req.body.password)))
      return res.status(401).json({ message: "Wrong password" });

    await user.populate("workspaces", "name").execPopulate();

    // Set refresh_token as an http-only cookie
    const refresh_token = await user.generateRefreshToken();
    res.cookie("refresh_token", refresh_token, cookieOptions);

    // generate access token and send back the response
    const access_token = user.generateAccessToken();
    return res.status(200).json({ token: access_token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes given refresh token from the DB and set's the cookie to null
 */
export const logOut: RequestHandler = async (req, res, next) => {
  const { refresh_token } = req.cookies;
  if (!refreshToken) return res.sendStatus(400);
  try {
    await RefreshToken.findOneAndDelete({ token: refresh_token }).exec();
    res.cookie("refresh_token", null);
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * Accepts an email confirmation token within the request body, if it's valid and didn't expire,
 * sets the user as 'verified' and returns a valid access token.
 */
export const confirmEmail: RequestHandler<
  unknown,
  unknown,
  { token: string }
> = async (req, res, next) => {
  const emailToken = req.body.token;
  /* 
  1. receive the email confirmation request with the token
  2. decode the token, check that it's still in db, else it's expired
  3. update the user status to verified
  4. send back an actual access token
  */
  try {
    const { sub } = validateToken(emailToken, EMAIL_SECRET);
    const emailTokenRecord = await ConfirmationToken.findOne({
      user_id: sub,
      token: emailToken,
    });

    if (!emailTokenRecord) throw new Error("Expired token"); //if the token is valid, but we couldn't find it in db - it expired or has been used

    const user = await User.findOneAndUpdate(
      { _id: sub },
      { is_verified: true }
    ).exec();
    await emailTokenRecord.remove();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = generateToken(user);
    await user.populate("workspaces", "name").execPopulate();
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new password reset token in the db and sends a mail message to the user
 */
export const forgotPassword: RequestHandler<
  unknown,
  unknown,
  { email: string }
> = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    const resetToken = await PasswordResetToken.create({
      user_id: user.id,
    });
    await sendMail({
      subject: "Password reset",
      to: user.email,
      html: resetPasswordTemplate(user.email, resetToken.token),
    });
    res.status(200).json({ message: "Password reset link sent to user email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler<
  unknown,
  unknown,
  { token: string; password: string }
> = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const existingToken = await PasswordResetToken.findOne({ token });
    if (!existingToken) {
      res.status(404).json({ message: "Expired or invalid token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(existingToken.user_id, {
      password: hashedPassword,
    }).exec();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const oldRefreshToken =
      req.cookies.refresh_token &&
      (await RefreshToken.findOne({
        token: req.cookies.refresh_token,
      }).exec());
    if (!oldRefreshToken) return res.sendStatus(401);
    const user = await User.findById(oldRefreshToken.user_id).exec();
    if (!user) return res.sendStatus(404);
    await user.populate("workspaces", "name").execPopulate();
    // Delete old refresh token
    await oldRefreshToken.remove();
    // Create new one
    const newRefreshToken = await user.generateRefreshToken();
    res.cookie("refresh_token", newRefreshToken, cookieOptions);
    // Send back user data, JWT, and the new refresh token
    return res.status(200).json({ token: user.generateAccessToken(), user });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns the specifics of invitation
 * @param req
 * @param res
 * @param next
 */
export const getInviteData: RequestHandler<{ invite_token: string }> = async (
  req,
  res,
  next
) => {
  const { invite_token } = req.params;
  try {
    const token_document = await InvitationToken.findOne({
      token: invite_token,
    }).exec();
    if (!token_document) return res.sendStatus(404);
    await token_document
      .populate({ path: "invited_by" })
      .populate({ path: "invited_to" })
      .execPopulate();
    res
      .status(200)
      .json(
        (token_document as unknown) as JSONify<InvitationTokenPopulatedDocument>
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Processes user's response to the invite.
 * The request has to be Authenticated
 * @param req
 * @param res
 * @param next
 */
export const processInviteResponse: RequestHandler<
  {
    invite_token: string;
  },
  unknown,
  { acceptInvite: boolean }
> = async (req, res, next) => {
  const { user } = req;
  if (!user) throw new Error("Expected authenticated request");
  const { invite_token } = req.params;
  const { acceptInvite } = req.body;
  try {
    const token_document = await InvitationToken.findOne({
      token: invite_token,
    }).exec();
    console.log(token_document);
    if (!token_document) return res.sendStatus(404);
    const { invited_to } = (await token_document
      .populate("invited_to")
      .execPopulate()) as any;
    if (acceptInvite) {
      user.workspaces.push(invited_to._id);
      invited_to.users.push(user._id);
      await Promise.all([user.save(), invited_to.save()]);
    }
    await token_document.remove();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
  return;
};
