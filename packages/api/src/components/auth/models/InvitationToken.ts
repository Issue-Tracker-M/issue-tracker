import { Document, Model, Schema, model } from "mongoose";
import generateInvitationToken from "../../../utils/generatePasswordResetToken";

export interface InvitationToken {
  workspace_id: string;
  email: string;
  user_id: string | null;
  token: string;
}

const tokenSchema = new Schema<InvitationTokenDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: "Users", default: null },
  workspace_id: { type: Schema.Types.ObjectId, ref: "Workspaces" },
  token: {
    type: String,
    required: true,
    unique: true,
    default: generateInvitationToken,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, required: true, expires: 43200, default: Date.now },
});

export interface InvitationTokenDocument extends InvitationToken, Document {}

export type TokenModel = Model<InvitationTokenDocument>;

export default model<InvitationTokenDocument, TokenModel>(
  "InvitationTokens",
  tokenSchema
);
