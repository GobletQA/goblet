import type { TFeatureAst } from '@ltipton/parkin'
import type { TAutomateElementEvent } from './shared.types'

export type TSocket = {
  [key:string]: any
}

export type TSelectFromBrowserRespEvent = TAutomateElementEvent & {
  // type: string,
  // target: string,
  // elementTag: string,
  // elementHtml: string
  // elementText: string
}

export type TCancelAutomateRespEvent = {}

export type TStartBrowserPlayOpts = {
  ast?: TFeatureAst
}

export type TIdleConnection = {
  idle?:boolean
  counter?:number
  connections?:number
  state?:`active`|`idle`
}