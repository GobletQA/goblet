import type { Options } from 'http-proxy-middleware'

export type TJwtConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}


export type TProxyOpts = Options & {
  host:string
  port?:string
  path?:string
  protocol?:string
}

export type TError = Error & {
  statusCode:number
}

export type TException = TError
