import { Document, Model, Types, Schema, model } from "mongoose";
import { IBaseUser } from "@issue-tracker/types";
import { WorkspaceDocument } from "../workspaces/model";

const UserSchema = new Schema<UserDocument>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, maxlength: 64 },
    email: { type: String, required: true, unique: true, trim: true },
    is_verified: { type: Boolean, default: false },
    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspaces",
      },
    ],
    provider_ids: {
      type: {
        google: { type: String, default: null },
      },
      required: false,
    },
  },
  { timestamps: true }
);

interface UserBaseDocument extends IBaseUser, Document {
  _id: Types.ObjectId;
  workspaces: Types.ObjectId[] | WorkspaceDocument[];
}

export interface UserDocument extends UserBaseDocument {
  workspaces: Types.Array<WorkspaceDocument["_id"]>;
}

export interface UserPopulatedDocument extends UserBaseDocument {
  workspaces: Types.DocumentArray<WorkspaceDocument>;
}

export type UserModel = Model<UserDocument>;

const Users = model<UserDocument, UserModel>("Users", UserSchema);

export default Users;
