import type { TControllerConfig } from './controller.types'

export type TKubeController = TControllerConfig & {
  namespace: string
}

export type TKubeErrorBody = {
  kind:string
  code:number
  reason:string
  status:string
  message:string
  apiVersion:string
  metadata: Record<string, any>
  details: {
    name:string
    kind:string
  }
}

export type TKubeError = Error & {
  statusCode: number | string
  body?:TKubeErrorBody
}

export type TWatchRes = Record<'abort', () => void>