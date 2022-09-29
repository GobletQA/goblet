export type ReduxAction = {
  type: string
  payload?: any
}

export interface BasicAction {
  type: string
}

export interface ActionPayload<P = void> extends BasicAction {
  payload: P
}

export type ReducerFunc<T> = (state: T, action: any) => T

export type ActionReducers<T> = { [actionName: string]: ReducerFunc<T> }

type Dispatcher<T extends (state: any, action: BasicAction) => any> =
  Parameters<T>[1] extends ActionPayload<infer P> ? (payload?: P) => void : () => void

export type AnyReducerFuncs<> = {
  [name: string]: (state: any, action: any) => any
}

export type ActionDispatcher<T extends AnyReducerFuncs> = {
  [K in keyof T]: Dispatcher<T[K]>
}
