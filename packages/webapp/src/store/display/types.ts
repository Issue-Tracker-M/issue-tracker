import { DbDocument, FullDocument, Stub } from "../types";
import { User, UserStub } from "../user/types";

export interface TaskStub
  extends Pick<Task, "_id" | "title" | "labels" | "workspace" | "list">,
    Stub {}

export interface List extends DbDocument, FullDocument {
  name: string;
  tasks: Task["_id"][];
}

interface WorkspaceBase extends DbDocument {
  name: string;
  admin: User["_id"];
}

export interface getWorkspaceResponse extends WorkspaceBase, FullDocument {
  labels: Label[];
  users: UserStub[];
  lists: List[];
}

export interface WorkspaceStub extends Pick<Workspace, "_id" | "name">, Stub {}

export interface Workspace extends DbDocument, FullDocument {
  name: string;
  labels: Label["_id"][];
  users: User["_id"][];
  admin: User["_id"];
  lists: List["_id"][];
}

export interface Label extends DbDocument {
  name: string;
  color: string;
}

export interface Task extends DbDocument, FullDocument {
  title: string;
  description?: string;
  workspace: Workspace["_id"];
  list: List["_id"];
  due_date: string | null;
  complete?: boolean;
  labels: Label["_id"][];
  users: User["_id"][];
  comments: Comment["_id"][];
}

export interface Comment extends DbDocument {
  content: string;
  author: User["_id"];
}

export enum Priority {
  low = "0",
  high = "1",
  urgent = "2",
}
