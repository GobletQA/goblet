
export type TLineFilter = (line:string) => string

export type TTailCallbacks = {
  onReady?:(fd:any) => any
  onLine?:(line:string) => any
  onError?:(error:Error) => any
}

export type TTailLogger = TTailCallbacks & {
  file:string
  start?:boolean
  create?:boolean
  truncate?:boolean
  filter?:TLineFilter
}
