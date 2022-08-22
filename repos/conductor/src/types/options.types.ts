import type { Options } from 'http-proxy-middleware'
import type { TPort } from './helpers.types'
import type { TContainerRoute } from './routes.types'
import type { TControllerType } from './controller.types'
import type { TImgConfig, TContainerConfig } from './conductor.types'

export type TContainerOpts = TContainerConfig & {
}

export type TImgOpts = TImgConfig & {
  tag: string
  name: string
  user: string
  provider: string
  container?: TContainerOpts
}

export type TImagesOpts = Record<string, TImgOpts>

export type TControllerOpts = {
  pidsLimit?: number
  type: TControllerType
  connect?: Record<any, any>
  devRouter?: TContainerRoute
}

export type TProxyOpts = {
  port?: TPort
  proxy?: Options
  target?: string
  headers?: Record<string, string>
}

export type TConductorOpts = {
  domain?: string
  altDomain?: string
  hashKey?: string
  subdomain?: string
  proxy?: TProxyOpts
  images: TImagesOpts
  controller?:TControllerOpts
}
