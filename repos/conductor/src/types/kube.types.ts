import type { V1Pod, KubernetesObject } from '@kubernetes/client-node'
import { TControllerConfig } from './controller.types'

export type TPod = V1Pod
export type TEventWatchObj = { type: string; object: KubernetesObject }
export type TKubeEventCB = (pod:TPod, watch:TEventWatchObj) => any

export type TKubeWatchEvents = {
  start?: TKubeEventCB
  added?: TKubeEventCB
  error?: TKubeEventCB
  destroy?: TKubeEventCB
  deleted?: TKubeEventCB
  bookmark?: TKubeEventCB
  modified?: TKubeEventCB
}

export type TKubeController = TControllerConfig & {
  namespace: string
}

export type TKubeError = Error & {
  statusCode: number | string
}


export type TKubeConfig = {
  namespace?: string
  events?: TKubeWatchEvents
}

export type TWatchRes = Record<'abort', () => void>
