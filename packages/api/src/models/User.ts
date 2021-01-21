import mongoose, { Document, Model, Types } from "mongoose";
import { WorkspaceDocument } from "./Workspace";

const UserSchema = new mongoose.Schema<User>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, maxlength: 64 },
    email: { type: String, required: true, unique: true, trim: true },
    is_verified: { type: Boolean, default: false },
    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspaces",
      },
    ],
    provider_ids: {
      type: {
        google: String,
        github: String,
      },
      required: false,
    },
  },
  { timestamps: true }
);
export interface User {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  is_verified: boolean;
  workspaces?: Types.ObjectId[] | WorkspaceDocument[];
  provider_ids?: {
    google?: string;
    github?: string;
  };
}

interface UserBaseDocument extends User, Document {}

export interface UserDocument extends UserBaseDocument {
  workspaces: Types.Array<WorkspaceDocument["_id"]>;
}

export interface UserPopulatedDocument extends UserBaseDocument {
  workspaces: Types.DocumentArray<WorkspaceDocument>;
}

export type UserModel = Model<UserDocument>;

export default mongoose.model<UserDocument, UserModel>("Users", UserSchema);
