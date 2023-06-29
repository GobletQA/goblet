import type { SocketService } from '@services/socketService'
import {TRepoApiObj} from './repo.types'

export type TSockCmdObj = {
  id:string
  cmd:string
  name:string
  group?:string
}

export type TSockCmd = string|TSockCmdObj

export type TSockCmds = {
  string: Record<string, TSockCmdObj>
}

export type TEndpointConf = {
  port?: string
  host?: string
  endpoint?: string
  namespace?: string
}

export type TSocketEvt<T=Record<string, any>> = {
  id: string
  name: string
  error:boolean
  group: string
  groupId: string
  message: string
  socketId: string
  timestamp: number
  isRunning: boolean
  data: T
}


export type TSocketEventCallback = (
  message:TSocketEvt,
  instance:SocketService,
  event:string,
) => any

export type TSocketEvtsFE = {
  [key:string]: TSocketEventCallback
} 


export type TSocketService = TEndpointConf & {
  path:string
  transports: string[]
  events:TSocketEvtsFE
  query: Record<string, string>
  extraHeaders: Record<string, string>
}

export type TSocketEmitData = {
  repo?:TRepoApiObj
  [K:string]:any
}
