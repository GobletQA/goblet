import { DockerOptions } from 'dockerode'

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

export type TControllerType = 'docker' | 'Docker'

export type TControllerConfig = DockerOptions & {
  pidsLimit?: number
  rateLimit?: number
  type: TControllerType
  options:DockerOptions
}
