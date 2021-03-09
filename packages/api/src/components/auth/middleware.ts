import { NextFunction, Request, RequestHandler, Response } from "express";
import { JWT_SECRET } from "../../config";
import validateToken from "../../utils/validateToken";
import User, { UserDocument } from "../users/model";

export interface RequestWithCredentials<P = any, B = any>
  extends Request<P, any, B, any> {
  headers: Request["headers"] & { authorization: string };
}

export interface AuthorizedRequest<P = any, B = any>
  extends RequestWithCredentials<P, B> {
  user: UserDocument;
}

/**
 * Validates token, extracts user id from token, fetches that user and assigns the user document to req.user
 * @param req
 * @param res
 * @param next
 */
export const authenticate = async (
  req: RequestWithCredentials<any, any>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sub: userID } = validateToken(
      req.headers.authorization,
      JWT_SECRET
    );
    const user = await User.findById(userID).exec();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    if (!(error instanceof Error)) return next(error);
    res.status(500).json({ message: `Confirmation failed ${error.message}` });
  }
};

/**
 * Check if request has Authorization header set to something
 * @param req
 * @param res
 * @param next
 */
export const checkForCredentials: RequestHandler = (req, res, next) => {
  if (req.headers.authorization) return next();
  res.status(400).json({ message: "Missing credentials" });
};

/**
 * Fetches a user document depending on the type of credential given, can either be username(alphanumeric) or email
 * @param req
 * @param res
 * @param next
 */
export const getUserByEmail: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user)
      return res.status(404).json({ message: "No user with such email" });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
