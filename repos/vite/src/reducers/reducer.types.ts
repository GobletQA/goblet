export type TReduxAction = {
  type: string
  payload?: any
}

export interface TBasicAction {
  type: string
}

export interface TActionPayload<P = void> extends TBasicAction {
  payload: P
}

export type ReducerFunc<T> = (state: T, action: any) => T

export type ActionReducers<T> = { [actionName: string]: ReducerFunc<T> }

/**
 * The following types are related to our action dispatchers
 */
type Dispatcher<T extends (state: any, action: TBasicAction) => any> =
  Parameters<T>[1] extends TActionPayload<infer P> ? (payload?: P) => void : () => void

export type TAnyReducerFuncs = {
  [name: string]: (state: any, action: any) => any
}

export type TActionDispatcher<T extends TAnyReducerFuncs> = {
  [K in keyof T]: Dispatcher<T[K]>
}

export type TAction<T> = {
  type: string
  payload: T
}