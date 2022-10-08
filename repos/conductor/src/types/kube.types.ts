import { TControllerConfig } from './controller.types'

export type TKubeEventCB = (message:TKubeEvent) => any


export type TKubeEvent = {
  
}

export type TKubeController = TControllerConfig & {
  namespace: string
}