import { EMAIL_SECRET } from "../../config";
import { RequestHandler } from "express";
import generateToken from "../../utils/generateToken";
import bcrypt from "bcrypt";
import sendMail from "../../utils/sendEmail";
import confirmEmailTemplate from "../../templates/confirmEmailTemplate";
import { validateToken } from "../../utils/validateToken";
import ConfirmationToken from "./models/ConfirmationToken";
import PasswordResetToken from "./models/PasswordResetToken";
import resetPasswordTemplate from "../../templates/resetPasswordTemplate";
import User, { UserDocument } from "../users/model";

/**
 * Data expected for initial registration
 */
export type registerInput = Pick<
  UserDocument,
  "first_name" | "last_name" | "password" | "email"
>;

/**
 * Creates a new user and sends an email confirmation letter.
 */
export const register: RequestHandler<null, any, registerInput> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { first_name, last_name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const user = await newUser.save();

    const token = generateToken(user, EMAIL_SECRET);

    await new ConfirmationToken({ user_id: user.id, token }).save();

    await sendMail({
      subject: "Welcome to Issue Tracker!",
      to: email,
      html: confirmEmailTemplate(first_name + last_name, token),
    });

    res.status(201).end();
  } catch (error: unknown) {
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
export const login: RequestHandler<null, any, loginInput> = async (
  req,
  res,
  next
) => {
  const { user } = req;
  try {
    if (!user) throw new Error("Missing user data");
    if (!user.is_verified) throw new Error("Email not verified");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(401).json({ message: "Wrong password" });

    const token = generateToken(user);
    await user.populate("workspaces", "name").execPopulate();
    return res.status(200).json({ token, user });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Accepts an email confirmation token within the request body, if it's valid and didn't expire,
 * sets the user as 'verified' and returns a valid access token.
 */
export const confirmEmail: RequestHandler<
  null,
  any,
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
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Creates a new password reset token in the db and sends a mail message to the user
 */
export const forgotPassword: RequestHandler<
  null,
  any,
  { email: string }
> = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    const resetToken = await new PasswordResetToken({
      user_id: user.id,
    }).save();
    await sendMail({
      subject: "Password reset",
      to: user.email,
      html: resetPasswordTemplate(user.email, resetToken.token),
    });
    res.status(200).json({ message: "Password reset link sent to user email" });
  } catch (error: unknown) {
    next(error);
  }
};

export const resetPassword: RequestHandler<
  null,
  any,
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
  } catch (error: unknown) {
    next(error);
  }
};
