export type TSocketMessageStr = string
export type TSocketMessageObj = {
  id?: string
  name?: string
  group?: string
  error?: boolean
  message?: string
  groupId?: string
  socketId?: string
  isRunning?: boolean
  timestamp?: string
  data?: Record<string, any>
}

export type TSocketMessage = TSocketMessageStr | TSocketMessageObj

export type TSockrProcessConfig = {
  root: string
  debug: boolean
  script: string
}

export type TSockrEvent = {
  [key:string]: any
}

export type TSockrEvents = {
  [key:string]: TSockrEvent | ((...args:any[]) => any)
}


export type TSockrAuthConfig = {
  onAuthFail:(...args:any[]) => any
  onAuthenticate:(...args:any[]) => any
}

export type TSockrConfig = TSockrAuthConfig & {
  path: string
  port: string
  host: string
  events?: TSockrEvents
  process: TSockrProcessConfig
  commands?: Record<string, any>
  filters?: Record<string, any>
}
