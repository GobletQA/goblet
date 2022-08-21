import type { Options } from 'http-proxy-middleware'
import type { TPort } from './helpers.types'
import type { TControllerType } from './controller.types'
import type { TImgConfig, TContainerConfig } from './conductor.types'

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
  port?: TPort
  proxy?: Options
  target?: string
  headers?: Record<string, string>
}

export type TConductorOpts = {
  domain?: string
  hashKey?: string
  subdomain?: string
  proxy?: TProxyOpts
  images: TImagesOpts
  controller?:TControllerOpts
}
