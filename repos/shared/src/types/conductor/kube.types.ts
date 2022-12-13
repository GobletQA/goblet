import { TControllerConfig } from './controller.types'

export type TKubeController = TControllerConfig & {
  namespace: string
}

export type TKubeError = Error & {
  statusCode: number | string
}

export type TWatchRes = Record<'abort', () => void>