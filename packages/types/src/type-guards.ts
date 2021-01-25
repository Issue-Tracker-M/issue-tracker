/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { IChannel, IMessage, ITeam } from "./types";

import { IBaseTask } from "./types";

/**
 * Check whether a given value is an array where
 * each member is of a specified type
 *
 * @param arr - array to check
 * @param check - type guard to use when evaluating each item
 * @public
 */
export function isTypedArray<T>(
  arr: unknown,
  check: (x: any) => x is T
): arr is T[] {
  if (!Array.isArray(arr)) return false;
  if (arr.some((item) => !check(item))) return false;
  return true;
}

/**
 * Check whether a given value is an {@link @issue-tracker/types#IBaseTask}
 * @param arg - value to check
 * @beta
 *
 * @example
 * ```ts
 * const task = { title:"This interface is supposed to be extended", labels:[], comments:[], users:[] };
 * isBaseTask(task); // true
 * ```
 */
export function isBaseTask(arg: any): arg is IBaseTask {
  return (
    typeof arg.title === "string" &&
    Array.isArray(arg.labels) &&
    Array.isArray(arg.comments) &&
    Array.isArray(arg.users)
  );
}

// /**
//  * Check whether a given value is an {@link @shlack/types#IChannel}
//  * @param arg - value to check
//  * @beta
//  */
// export function isChannel(arg: any): arg is IChannel {
//   return (
//     typeof arg.id === "string" &&
//     typeof arg.teamId === "string" &&
//     typeof arg.description === "string" &&
//     typeof arg.name === "string"
//   );
// }

// /**
//  * Check whether a given value is an {@link @shlack/types#IMessage}
//  * @param arg - value to check
//  * @beta
//  */
// export function isMessage(arg: any): arg is IMessage {
//   return (
//     typeof arg.teamId === "string" &&
//     typeof arg.channelId === "string" &&
//     typeof arg.userId === "string" &&
//     typeof arg.body === "string"
//   );
// }
