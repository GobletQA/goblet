import type { DockerOptions } from 'dockerode'
import type { TRouteMeta } from './routes.types'
import type { TContainerMap } from './helpers.types'

export type TControllerEvt = (message?:Record<any, any>) => void

export type TControllerEvts = {
  die?: TControllerEvt
  start?: TControllerEvt
  stop?: TControllerEvt
  create?: TControllerEvt
  destroy?: TControllerEvt
  connect?: TControllerEvt
  message?: TControllerEvt
  disconnect?: TControllerEvt
}

export type TControllerType = 'docker' | 'Docker' | 'Kube' | 'kube'
export type TOnContainerRemove = (container:TContainerMap) => void

export type TControllerConfig = {
  pidsLimit?: number
  rateLimit?: number
  type: TControllerType
  options:DockerOptions
  devRouter?: TRouteMeta
  listenerTimeout?:number
  onRemove?: TOnContainerRemove
}
