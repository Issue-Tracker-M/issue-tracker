export interface DbDocument {
  readonly _id: string;
}

export interface Stub {
  loaded: false;
}

export interface FullDocument {
  loaded: true;
  createdAt: string;
  updatedAt: string;
}

export enum EntityNames {
  users = "users",
  workspaces = "workspaces",
  tasks = "tasks",
  lists = "lists",
  comments = "comments",
}
