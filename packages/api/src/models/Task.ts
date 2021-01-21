import mongoose, { Document, Model, Types } from "mongoose";
import { UserDocument } from "./User";
import { Label, WorkspaceDocument } from "./Workspace";

export interface IComment {
  content: string;
  author: UserDocument["_id"];
}

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

export interface CommentDocument extends IComment, Document {}

export enum Priority {
  not_set,
  low,
  high,
  urgent,
}

export interface ITask {
  title: string;
  description?: string;
  workspace: WorkspaceDocument["_id"];
  due_date?: Date;
  complete?: boolean;
  labels?: Label[];
  users?: UserDocument["_id"][] | UserDocument[];
  comments?: IComment[];
}

interface TaskBaseDocument extends ITask, Document {
  priority: number;
  comments: Types.DocumentArray<CommentDocument>;
  labels: Types.Array<Document["_id"]>;
}

export interface TaskDocument extends TaskBaseDocument {
  users: Types.Array<UserDocument["_id"]>;
}
export interface TaskPopulatedDocument extends TaskBaseDocument {
  users: Types.DocumentArray<UserDocument>;
}

export type TaskModel = Model<TaskDocument>;

const Task = mongoose.model<TaskDocument, TaskModel>(
  "Tasks",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: String,
      due_date: { type: Date, required: false },
      complete: { type: Boolean, required: false },
      workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspaces" },
      labels: [
        {
          name: String,
          color: String,
          id: mongoose.Types.ObjectId,
        },
      ], //reference to labels within this tasks workspace
      users: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Users",
        },
      ],
      comments: [CommentSchema],
      // attachments:[String],
    },
    { timestamps: true }
  )
);

export default Task;
