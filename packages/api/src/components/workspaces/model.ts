import { IBaseList, IBaseWorkspace } from "@issue-tracker/types";
import { Document, Model, Types, Schema, model } from "mongoose";
import { TaskDocument } from "../tasks/model";
import { UserDocument } from "../users/model";

export interface Label {
  name: string;
  color: string;
}

export interface LabelDocument extends Label, Document {
  _id: Types.ObjectId;
}

const LabelSchema = new Schema<LabelDocument>({
  name: String,
  color: String, //hex color code
});

export interface Change {
  [key: string]: unknown;
}

export interface ChangeDocument extends Change, Document {}

const ChangeSchema = new Schema({
  //   text: String,
  // what happened // string based on the type of change or a type of possible action

  // what changed  // a reference to the document in the Db, preferably by it's id
  target: { type: Types.ObjectId },
  subtarget: { type: Types.ObjectId, required: false },
  // who did it  // reference to the user id
  user: { type: Types.ObjectId, ref: "Users" },
});

// List of tasks
interface ListBaseDocument extends IBaseList, Document {
  _id: Types.ObjectId;
}
export interface ListDocument extends IBaseList, ListBaseDocument {
  tasks: Types.Array<TaskDocument["_id"]>;
}
export interface ListPopulatedDocument extends IBaseList, ListBaseDocument {
  tasks: Types.Array<TaskDocument["_id"]>;
}

const ListSchema = new Schema<ListDocument>({
  name: { type: String, required: true },
  tasks: [{ type: Types.ObjectId, ref: "Tasks" }],
});

interface WorkspaceBaseDocument extends IBaseWorkspace, Document {
  _id: Types.ObjectId;
  labels: Types.DocumentArray<LabelDocument>;
  lists: Types.DocumentArray<ListDocument>;
  users: Types.Array<UserDocument["_id"]> | Types.DocumentArray<UserDocument>;
}

export interface WorkspaceDocument extends WorkspaceBaseDocument {
  // lists: Types.Array<ListDocument["_id"]>;
  users: Types.Array<UserDocument["_id"]>;
  admin: UserDocument["_id"];
  a: ListDocument;
}

export interface WorkspacePopulatedDocument extends WorkspaceBaseDocument {
  users: Types.DocumentArray<UserDocument>;
  admin: UserDocument;
}

export type WorkspaceModel = Model<WorkspaceDocument>;

const Workspaces = model<WorkspaceDocument>(
  "Workspaces",
  new Schema<WorkspaceDocument>(
    {
      name: { type: String, required: true },
      labels: [LabelSchema], //all of labels defined for this workspace
      users: [{ type: Types.ObjectId, ref: "Users" }], //references to all the users
      admin: { type: Types.ObjectId, ref: "Users", required: true },
      lists: {
        type: [ListSchema],
        default: () => [
          { name: "Todo" },
          { name: "In Progress" },
          { name: "Complete" },
        ],
      },
      history: [ChangeSchema],
    },
    { timestamps: true }
  )
);

export default Workspaces;
