import { Document, Types } from "mongoose";
/**
 * @private
 * Excludes fields specific to mongoose documents from a type
 */
export type JSONed<T> = Pick<
  T,
  Exclude<keyof T, Exclude<keyof Document, "_id" | "createAt" | "updatedAt">>
>;

/**
 * @private
 * Recursively applies itself to mongoose documents
 * Intended to represent transformation from a mongoose document to JSON object
 */
export type JSONify<T> = T extends Types.ObjectId
  ? string
  : {
      [P in keyof JSONed<T>]: T[P] extends Types.ObjectId
        ? string
        : T[P] extends Types.Array<infer K>
        ? JSONify<K>[]
        : T[P] extends Document
        ? JSONify<T[P]>
        : T[P];
    };
