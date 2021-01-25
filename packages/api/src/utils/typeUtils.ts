import { Document } from "mongoose";
export type JSONed<T> = Pick<
  T,
  Exclude<keyof T, Exclude<keyof Document, "_id">>
>;
