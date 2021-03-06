import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { UserDocument } from "../components/users/model";

export default function generateToken(
  user: UserDocument,
  secret = JWT_SECRET
): string {
  const payload = {
    sub: user._id,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}
