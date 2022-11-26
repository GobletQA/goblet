import type {Socket, Server} from 'socket.io'
import type { SocketManager } from '@gobletqa/screencast'

export enum ESocketEnvironment {
  local = 'local',
  development = 'development',
  dev = 'dev',
  qa = 'qa',
  stag = 'stag',
  staging = 'staging',
  demo = 'demo',
  prod = 'prod',
  production = 'production',
}

export type TSocketTokenValid = {
  iat:string
  exp:string
  token: string
  log?:boolean
  name?:string
  email?:string
  remote?:string
  branch?:string
  username?:string
  error?:never
} 

export type TSocketTokenErr = {
  iat?:never
  exp?:never
  token?:never
  error:Error
}

export type TSocketTokenData = TSocketTokenValid | TSocketTokenErr

export type TSocketEvtCBProps = {
  io:Server
  socket:Socket
  event:string
  config:TSocketConfig
  Manager:SocketManager
  data:Record<string, any>
}

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

export type TCmdEnvGroup = {
  [key in ESocketEnvironment]?: TCmdsConfig
}

export type TCmdGroup = {
  filters: {},
  commands: TCmdEnvGroup
}

export type TCmdGroups = {
  default?: TCmdGroup
  [k:string]:TCmdGroup
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
  params?:string[]
  socketId?: string
  isRunning?: boolean
  timestamp?: string
  stopWatching?:boolean
  data?: Record<string, any>
}

export type TSocketMessage = TSocketMessageStr | TSocketMessageObj

export type TSockrEventCB = (props:TSocketEvtCBProps) => any

export type TSockrEvents = {
  [key:string]: TSockrEventCB
}

export type TSockrAuthConfig = {
  onAuthFail?:(...args:any[]) => any
  onAuthenticate?:(...args:any[]) => any
}

export type TSocketConfig = TSockrAuthConfig & {
  path: string
  port: string
  host: string
  groups: TCmdGroups
  filters?: TFilterObj
  events?: TSockrEvents
  commands?: TCmdsConfig
  process: Partial<TProcConfig>
}

export type TSocketConfigOpts = {
  path?:string
  host?:string
  port?:string
  groups: TCmdGroups
  process: Partial<TProcConfig>
}
