import type { TContainerMap } from './helpers.types'
import type { TContainerConfig } from './conductor.types'

import type {
  Image,
  ContainerInfo,
  ContainerInspectInfo,
} from 'dockerode'

export type TDockerAuth = {
  key?: string
  auth?: string,
  email?: string,
  username?: string,
  password?: string,
  serveraddress?: string
}

export type TPullOpts = {
  [key:string]: any
  authconfig: TDockerAuth
}

export type TContainerLabels = Record<string, string>

export type TContainerInspect = ContainerInspectInfo & {}
export type TContainerInfo = ContainerInfo & {
  Name: string
}

export type TContainerRef = string | TContainerInfo | TContainerInspect | TContainerMap

export type TImageObj = Image & {
  [key:string]: any
}

// TODO: Update this to whatever options end up being correct for spawning a new container
export type TRunOpts = {
  tag?: string
  name?: string
  user?: string
  provider?: string
  pidsLimit?: number
  container?: TContainerConfig
  hostConfig?: Record<any, any>
}

export type TRunResponse = {
  urls?: Record<string, string>
  meta?: Record<string, any>
}


export type TDockerActorAttrs = {
  image: string
  name: string
  [key:string]: string
}

export type TDockerEventActor = {
  ID: string
  Attributes: TDockerActorAttrs
}

export type TDockerEvent = {
  id: string,
  from: string,
  Type: string,
  time: number,
  scope: string,
  status: string
  Action: string,
  timeNano: number
  Actor: TDockerEventActor,
}
