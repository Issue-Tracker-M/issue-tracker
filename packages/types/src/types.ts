// /**
//  * Used to extend more general interfaces.
//  * @private
//  */
// interface Entity {
//   _id: string;
// }

/**
 * An app user.
 * @private
 */
export interface IBaseUser {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  is_verified: boolean;
  workspaces: unknown[];
  provider_ids: {
    google: string | null;
  };
}

/**
 * Comment belonging to a task
 * @private
 */
export interface IBaseComment {
  content: string;
  author: unknown;
}

/**
 * A task, belonging to a list and containing comments and references to users & labels
 * @private
 *
 */
export interface IBaseTask {
  title: string;
  description: string | null;
  due_date: Date | null;
  complete: boolean;
  list: unknown;
  workspace: unknown;
  labels: unknown[];
  users: unknown[];
  comments: unknown[];
}

// /**
//  * A chat channel, containing munknown chat messages
//  * @private
//  */
// export interface IChannel {
//   teamId: string;
//   name: string;
//   description: string;
//   id: string;
//   messages: IMessage[];
// }

export interface IBaseWorkspace {
  name: string;
  labels: unknown[];
  users: unknown[];
  admin: unknown;
  lists: unknown[];
}

export interface IBaseList {
  name: string;
  tasks: unknown[];
}

export interface IBaseLabel {
  name: string;
  color: string;
}

export interface IBaseComment {
  content: string;
  author: unknown;
}
