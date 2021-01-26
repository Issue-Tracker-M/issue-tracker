import { IBaseComment, IBaseTask } from "@issue-tracker/types";
import { Document, Model, Types, Schema, model } from "mongoose";
import {
  LabelDocument,
  ListDocument,
  WorkspaceDocument,
} from "../workspaces/model";
import { UserDocument } from "../users/model";

const CommentSchema = new Schema<CommentDocument>(
  {
    content: { type: String, required: true },
    author: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

export interface CommentDocument extends IBaseComment, Document {
  _id: Types.ObjectId;
  author: UserDocument["_id"];
}

interface TaskBaseDocument extends IBaseTask, Document {
  _id: Types.ObjectId;
  list: ListDocument["_id"];
  workspace: WorkspaceDocument["_id"];
  comments: Types.DocumentArray<CommentDocument>;
  labels: Types.Array<LabelDocument["_id"]>;
  users: Types.Array<UserDocument["_id"]> | Types.DocumentArray<UserDocument>;
}

export interface TaskDocument extends TaskBaseDocument {
  users: Types.Array<UserDocument["_id"]>;
}
export interface TaskPopulatedDocument extends TaskBaseDocument {
  users: Types.DocumentArray<UserDocument>;
}

export type TaskModel = Model<TaskDocument>;

const Task = model(
  "Tasks",
  new Schema<TaskDocument>(
    {
      title: { type: String, required: true },
      description: { type: String, required: true, default: null },
      due_date: { type: Date, required: false, default: null },
      complete: { type: Boolean, required: false, default: false },
      workspace: { type: Types.ObjectId, ref: "Workspaces", required: true },
      list: { type: Types.ObjectId, required: true },
      labels: [String], //reference to labels within this tasks workspace
      users: [
        {
          type: Types.ObjectId,
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
