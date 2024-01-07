import type { Conductor } from '../conductor'
import type { V1Pod, V1ObjectMeta, KubernetesObject } from '@kubernetes/client-node'
import type {
  TPort,
  TPortsMap,
  TUserHash,
  TRouteMeta,
  TContainerMap,
  TContainerMeta,
} from '@gobletqa/shared/types'
import type { HttpProxyMiddleware } from 'http-proxy-middleware/dist/http-proxy-middleware'
export {
  HttpProxyMiddleware
}

export type TPod = V1Pod
export type TPodManifest = V1Pod & {
  metadata: TPodMeta
}

export type TPodRef = TContainerMap | TPod | string

export type TRemoveOpts = {
  userHash?:string
  throwOnEmpty?:boolean
  isContainerMap?:boolean
}

export type TPodMeta = Omit<V1ObjectMeta, `name` | `namespace`> & {
  name: string
  namespace: string
}

export type TGenRoute = {
  hostPort:TPort,
  userHash:TUserHash
  containerPort:TPort
  conductor:Conductor
  meta: TContainerMeta
}

export type TGenRoutes = {
  ports:TPortsMap
  userHash:TUserHash
  conductor:Conductor
  meta: TContainerMeta
}

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

export type TKubeConfig = {
  namespace?: string
  events?: TKubeWatchEvents
}


export type TValidateRouteCB = (route:TRouteMeta) => Promise<boolean>