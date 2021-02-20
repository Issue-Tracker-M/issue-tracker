import { Document, Model, Schema, model } from "mongoose";
import generateInvitationToken from "../../../utils/generatePasswordResetToken";

export interface InvitationToken {
  /**
   * Id of the user who sent the invite
   */
  invited_by: string;
  /**
   * Id of the workspace user is invited to
   */
  invited_to: string;
  /**
   * Email to which the invite has been sent
   */
  email: string;
  /**
   * Id of the user invite has been sent to, null if user with such email does not exist in the db
   */
  user_id: string | null;
  /**
   * Unique token string used as the identifier for the invitation
   */
  token: string;
}

const tokenSchema = new Schema<InvitationTokenDocument>({
  invited_by: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  invited_to: {
    type: Schema.Types.ObjectId,
    ref: "Workspaces",
    required: true,
  },
  user_id: { type: Schema.Types.ObjectId, ref: "Users", default: null },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: generateInvitationToken,
  },
  createdAt: { type: Date, required: true, expires: 43200, default: Date.now },
});

export interface InvitationTokenDocument extends InvitationToken, Document {}

export type TokenModel = Model<InvitationTokenDocument>;

export default model<InvitationTokenDocument, TokenModel>(
  "InvitationTokens",
  tokenSchema
);
