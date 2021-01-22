import { Document, Model, Schema, model } from "mongoose";
import generatePasswordResetToken from "../utils/generatePasswordResetToken";

export interface PasswordResetToken {
  user_id: Schema.Types.ObjectId;
  token: string;
}

const tokenSchema = new Schema<PasswordTokenDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  token: {
    type: String,
    required: true,
    unique: true,
    default: generatePasswordResetToken,
  },
  createdAt: { type: Date, required: true, expires: 43200, default: Date.now },
});

export interface PasswordTokenDocument extends PasswordResetToken, Document {}

export type TokenModel = Model<PasswordTokenDocument>;

export default model<PasswordTokenDocument, TokenModel>(
  "PasswordResetTokens",
  tokenSchema
);
