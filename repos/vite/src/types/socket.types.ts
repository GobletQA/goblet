import type { SocketService } from '@services/socketService'

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

export type TSocketEvt = {
  [key:string]: any
}


export type TSocketEventCallback = (
  message:TSocketEvt,
  instance:SocketService,
  event:string,
) => any

export type TSocketEvents = {
  [key:string]: TSocketEventCallback
} 


export type TSocketService = TEndpointConf & {
  path:string
  transports: string[]
  events:TSocketEvents
  query: Record<string, string>
  extraHeaders: Record<string, string>
}