import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const validateToken = (
  token: string,
  secret = JWT_SECRET
): string | { [key: string]: any } => {
  return jwt.verify(token, secret);
};

export default validateToken;
