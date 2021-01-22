import '@testing-library/jest-dom/extend-expect'
import { RootState } from './store/rootReducer'

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
}

declare module 'normalizr' {
  declare namespace schema {
    export type SchemaFunction<T> = (
      value: T,
      parent: any,
      key: string
    ) => string
    export interface EntityOptions<T = any> {
      idAttribute?: keyof T | SchemaFunction<T>
      mergeStrategy?: MergeFunction
      processStrategy?: StrategyFunction<T>
      fallbackStrategy?: FallbackFunction<T>
    }
    export class Entity<T = any> {
      constructor(
        key: string | symbol,
        definition?: Schema,
        options?: EntityOptions<T>
      )
      define(definition: Schema): void
      key: string
      getId: SchemaFunction<T>
      _processStrategy: StrategyFunction<T>
    }
  }
}

type U<T> = { [K in keyof T]: Pick<T, K> }
export type AtLeastOne<T> = Partial<T> & U<Required<T>>[keyof U<T>]
