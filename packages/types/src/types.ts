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
  workspaces: any[];
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
  author: any;
}

/**
 * A task, belonging to a list and containing comments and references to users & labels
 * @public
 *
//  * @remarks
//  * The {@link @issue-tracker/types#isTeam} type guard may be used to
//  * detect whether a value conforms to this interface
 */
export interface IBaseTask {
  title: string;
  description?: string;
  list: any;
  due_date?: Date;
  complete?: boolean;
  labels: any[];
  users: any[];
  comments: any[];
}

// /**
//  * A chat channel, containing many chat messages
//  * @public
//  */
// export interface IChannel {
//   teamId: string;
//   name: string;
//   description: string;
//   id: string;
//   messages: IMessage[];
// }
