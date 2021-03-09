import { Document, Model, Schema, model } from "mongoose";
import generatePasswordResetToken from "../../../utils/generatePasswordResetToken";

export interface RefreshToken {
  user_id: Schema.Types.ObjectId;
  token: string;
}

const tokenSchema = new Schema<RefreshTokenDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  token: {
    type: String,
    required: true,
    unique: true,
    default: generatePasswordResetToken,
  },
  // Expires in a week
  createdAt: {
    type: Date,
    required: true,
    expires: 60 * 60 * 24 * 7,
    default: Date.now,
  },
});

export interface RefreshTokenDocument extends RefreshToken, Document {}

export type RefreshTokenModel = Model<RefreshTokenDocument>;

export default model<RefreshTokenDocument, RefreshTokenModel>(
  "RefreshTokens",
  tokenSchema
);
