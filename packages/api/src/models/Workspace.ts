import mongoose, { Document, Model, Types } from "mongoose";
import { TaskDocument } from "./Task";
import { UserDocument } from "./User";

export interface List {
  name: string;
}

// const ListSchema = new mongoose.Schema({
//   name: String,
// });

export interface Label {
  name: string;
  color: string;
}

export interface LabelDocument extends Label, Document {}

const LabelSchema = new mongoose.Schema({
  name: String,
  color: String, //hex color code
});

export interface Change {
  [key: string]: unknown;
}

export interface ChangeDocument extends Change, Document {}

const ChangeSchema = new mongoose.Schema({
  //   text: String,
  // what happened // string based on the type of change or a type of possible action

  // what changed  // a reference to the document in the Db, preferably by it's id
  target: { type: mongoose.Types.ObjectId },
  subtarget: { type: mongoose.Types.ObjectId, required: false },
  // who did it  // reference to the user id
  user: { type: mongoose.Types.ObjectId, ref: "Users" },
});

export interface Workspace {
  name: string;
  labels?: Label[];
  users?: UserDocument["_id"][] | UserDocument[];
  admin: UserDocument["_id"] | UserDocument;
  // lists: List[];
  todo?: TaskDocument["_id"][] | TaskDocument[];
  in_progress?: TaskDocument["_id"][] | TaskDocument[];
  completed?: TaskDocument["_id"][] | TaskDocument[];
  // tasks?: TaskDocument["_id"][] | TaskDocument[];
  history?: Change[];
}

interface WorkspaceBaseDocument extends Workspace, Document {
  labels: Types.DocumentArray<LabelDocument>;
  history: Types.DocumentArray<ChangeDocument>;
}

export interface WorkspaceDocument extends WorkspaceBaseDocument {
  // tasks: Types.Array<TaskDocument["_id"]>;
  todo: Types.Array<TaskDocument["_id"]>;
  in_progress: Types.Array<TaskDocument["_id"]>;
  completed: Types.Array<TaskDocument["_id"]>;
  users: Types.Array<UserDocument["_id"]>;
  admin: UserDocument["_id"];
}

export interface WorkspacePopulatedDocument extends WorkspaceBaseDocument {
  // tasks: Types.Array<TaskDocument>;
  todo: Types.DocumentArray<TaskDocument>;
  in_progress: Types.DocumentArray<TaskDocument>;
  completed: Types.DocumentArray<TaskDocument>;
  users: Types.DocumentArray<UserDocument>;
  admin: UserDocument;
}

export type WorkspaceModel = Model<WorkspaceDocument>;

const Workspaces = mongoose.model<WorkspaceDocument, WorkspaceModel>(
  "Workspaces",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      labels: [LabelSchema], //all of labels defined for this workspace
      users: [{ type: mongoose.Types.ObjectId, ref: "Users" }], //references to all the users
      admin: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
      // lists: [ListSchema],
      // tasks: [{ type: mongoose.Types.ObjectId, ref: "Tasks" }],
      todo: [{ type: mongoose.Types.ObjectId, ref: "Tasks" }],
      in_progress: [{ type: mongoose.Types.ObjectId, ref: "Tasks" }],
      completed: [{ type: mongoose.Types.ObjectId, ref: "Tasks" }],
      history: [ChangeSchema],
    },
    { timestamps: true }
  )
);

export default Workspaces;
