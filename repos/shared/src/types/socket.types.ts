
export type TProcConfig = {
  root: string,
  script: string,
  debug: boolean,
  exec: TCmdExecOpts,
  command: Partial<TCmdConfig> & {
    overrides: [],
    default: string,
  },
}

export type TCmdExecOpts = {
  cwd?: string
  gid?: number,
  uid?: number,
  shell?: string,
  detached?: boolean,
  stdio?: string | string[],
  env?:Record<string, string>,
}

export type TCmdExecEvents = {
  onError?:(error:string, pid:string) => any
  onExit?:(code:number) => any
  onStdOut?:(data:string, pid:string) => any
  onStdErr?:(error:string, pid:string) => any
}

export type TCmdConfig = {
  exec: boolean
  script: string
  cmd?:string,
  command?: string
  name:string,
  id?:string,
  group?:string
}

export type TCmdMessage = {
  name:string
  cmd:string
  group:string
  socketId?:string
  afterArgs?:string[]
  beforeArgs?:string[]
  params?:string[]
}

export type TCmdsConfig = {
  [k:string]: TCmdConfig
}

export type TFilterObj = {
  all: string[]
  [k:string]:  string[]
} 

export type TFilterArgs = {
  filters:Record<any, string[]>
  data: string
  cmd: string
  commands:Record<any, any>
  group: string
}

export type TSocketMessageStr = string
export type TSocketMessageObj = {
  id?: string
  name?: string
  cmd?: string
  group?: string
  error?: boolean
  message?: string
  groupId?: string
  socketId?: string
  isRunning?: boolean
  timestamp?: string
  params?:string[]
  data?: Record<string, any>
}

export type TSocketMessage = TSocketMessageStr | TSocketMessageObj

export type TSockrEvent = {
  [key:string]: any
}

export type TSockrEvents = {
  [key:string]: TSockrEvent | ((...args:any[]) => any)
}


export type TSockrAuthConfig = {
  onAuthFail?:(...args:any[]) => any
  onAuthenticate?:(...args:any[]) => any
}

export type TSocketConfig = TSockrAuthConfig & {
  path: string
  port: string
  host: string
  filters?: TFilterObj
  events?: TSockrEvents
  commands?: TCmdsConfig
  process: Partial<TProcConfig>
}
