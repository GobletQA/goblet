import { TControllerType } from './controller.types'
import { TImgConfig, TContainerConfig, TLogLevel } from './conductor.types'

export type TContainerOpts = TContainerConfig & {}

export type TImgOpts = TImgConfig & {
  container?: TContainerOpts
}

export type TImagesOpts = {
  [key:string]: TImgOpts
}

export type TControllerOpts = {
  pidsLimit?: number
  type: TControllerType
  connect?: Record<any, any>
}

export type TProxyOpts = {
  host?: string
  timeout?: number
  secret?: string
  rateLimit?: number
  logLevel?: TLogLevel
  port?: string | number
}

export type TConductorOpts = {
  proxy?: TProxyOpts
  images:  TImagesOpts
  controller?:TControllerOpts
}
