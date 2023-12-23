import type { TGitData } from './git.types'
import type {Socket, Server} from 'socket.io'
import type { TTokenUser } from './user.types'
import type { TBrowserConf } from './pw.types'
import type {
  SocketManager,
  TWebSocketEvent,
  TWebSocketEvents,
} from '../../../screencast/src/types/socket.types'

export type TSocketEvent = TWebSocketEvent

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

export type TSocketTokenValid = TTokenUser & {
  iat:string
  exp:string
  log?:boolean
  error?:never
} 

export type TSocketTokenErr = {
  iat?:never
  exp?:never
  token?:never
  error:Error
}

export type TSocketTokenData = TSocketTokenValid | TSocketTokenErr

export type TSocketData<T extends Record<string, any>=Record<string, any>> = T & {
  url?:string
  repo?:TGitData
  browser?:TBrowserConf
  [key:string]: any
}

export type TSocketEvtCBProps<T extends Record<string, any>=Record<string, any>> = {
  io:Server
  event:string
  socket:Socket
  user:TTokenUser
  config:TSocketConfig
  Manager:SocketManager
  data:TSocketData<T>
}

export type TSocketMessageStr = string
export type TSocketMessageObj = {
  id: string
  name?: string
  cmd?: string
  group?: string
  error?: boolean
  message?: string
  groupId?: string
  params?:string[]
  timestamp: string
  socketId?: string
  isRunning?: boolean
  stopWatching?:boolean
  data?: Record<string, any>
}

export type TSocketMessage = TSocketMessageStr | TSocketMessageObj

export type TSocketEventCB = (props:TSocketEvtCBProps) => any

export type TSocketEvents = {
  [key in keyof TWebSocketEvents]?: TSocketEventCB
}

export type TSocketAuthConfig = {
  onAuthFail?:(...args:any[]) => any
  onAuthenticate?:(...args:any[]) => any
}

export type TSocketServer = {
  path: string
  port: string
  host: string
}

export type TSocketConfig = TSocketAuthConfig & {
  socket:TSocketServer
  events?: TSocketEvents
}

export type TSocketConfigOpts = {
  path?:string
  host?:string
  port?:string
}
