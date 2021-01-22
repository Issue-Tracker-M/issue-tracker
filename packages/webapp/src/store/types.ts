export interface DbDocument {
  readonly _id: string
}

export interface Stub {
  loaded: false
}

export interface FullDocument {
  loaded: true
}

export enum EntityNames {
  users = 'users',
  workspaces = 'workspaces',
  tasks = 'tasks',
  labels = 'labels',
  comments = 'comments'
}
