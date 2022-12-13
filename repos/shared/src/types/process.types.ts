
export type TProc = {
  name:string
  tty:string
  time:string
  running:boolean
  pid: string|number
}

export type TBrowserProcs = {
  chrome?:TProc
  chromium?:TProc
  firefox?:TProc
  webkit?:TProc
}

type TProcFunc = (...args:any[]) => any
export type TChildProc = {
  stdin:TProcFunc
  stderr:TProcFunc
  stdout:TProcFunc
  kill:TProcFunc
  disconnect:TProcFunc
  unref:TProcFunc
  ref:TProcFunc
  on:TProcFunc
  emit:TProcFunc
  once:TProcFunc
  send:TProcFunc
  addListener:TProcFunc
  killed:boolean
  connected:boolean
  exitCode:number
  stdio: any[]
}