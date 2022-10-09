import { DockerOptions } from 'dockerode'
import { TRouteMeta } from './routes.types'

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

export type TPortsMap = Record<string, string>

export type TCreatePortsObj = {
  ports: TPortsMap
  exposed: Record<string, Record<any, any>>
  bindings: Record<string, Record<'HostPort', string>[]>
}

export type TControllerType = 'docker' | 'Docker' | 'Kube' | 'kube'

export type TControllerConfig = {
  pidsLimit?: number
  rateLimit?: number
  type: TControllerType
  options:DockerOptions
  devRouter?: TRouteMeta
}

// TODO: Update to use this general object as the main route interface
// Both docker and kube make to this 
// Instead of ContainerInspect || Pod
export type TCtlContainer = {
  id: string
  ip?: string
  name: string
  state?: string
  labels: Record<string, string>
  ports: Record<string, string>
}