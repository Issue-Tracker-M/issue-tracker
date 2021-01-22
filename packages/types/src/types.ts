// /**
//  * Used to extend more general interfaces.
//  * @private
//  */
// interface Entity {
//   _id: string;
// }

/**
 * An app user.
 * @public
 */
export interface IBaseUser {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  is_verified: boolean;
  workspaces: unknown[];
  provider_ids: {
    google: string;
  };
}

/**
 * Comment belonging to a task
 * @public
 */
export interface IBaseComment {
  content: string;
  author: unknown;
}

/**
 * A task, belonging to a list and containing comments and references to users & labels
 * @public
 *
//  * @remarks
//  * The {@link @issue-tracker/types#isBaseTask} type guard may be used to
//  * detect whether a value conforms to this interface
 */
export interface IBaseTask {
  title: string;
  description?: string;
  list: unknown;
  due_date?: Date;
  complete?: boolean;
  labels: unknown[];
  users: unknown[];
  comments: unknown[];
}

// /**
//  * A chat channel, containing munknown chat messages
//  * @public
//  */
// export interface IChannel {
//   teamId: string;
//   name: string;
//   description: string;
//   id: string;
//   messages: IMessage[];
// }
