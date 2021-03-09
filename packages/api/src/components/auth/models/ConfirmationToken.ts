import { Document, Model, Schema, model } from "mongoose";

export interface ConfirmationToken {
  user_id: Schema.Types.ObjectId;
  token: string;
}

const tokenSchema = new Schema<ConfirmationTokenDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, expires: 43200, default: Date.now },
});

export interface ConfirmationTokenDocument
  extends ConfirmationToken,
    Document<Schema.Types.ObjectId> {}

export type TokenModel = Model<ConfirmationTokenDocument>;

export default model<ConfirmationTokenDocument, TokenModel>(
  "ConfirmationTokens",
  tokenSchema
);
