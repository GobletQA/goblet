import type { EAppStatus } from './app.types'
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
  state?:EAppStatus
}


export type TPWConsoleMethods = Pick<Console,
  `log`
  |`debug`
  |`info`
  |`error`
  |`warn`
  |`dir`
  |`table`
  |`count`
  |`countReset`
  |`trace`
  |`clear`
  |`assert`
  |`profile`
  |`profileEnd`
  |`count`
  |`timeEnd`
  
>

export enum EPWConsoleMethod {
  log=`log`,
  debug=`debug`,
  info=`info`,
  error=`error`,
  warn=`warn`,
  warning=`warn`,
  dir=`dir`,
  dirxml=`dirxml`,
  table=`table`,
  count=`count`,
  countReset=`countReset`,
  trace=`trace`,
  clear=`clear`,
  assert=`assert`,
  profile=`profile`,
  profileEnd=`profileEnd`,
  timeEnd=`timeEnd`,
}

export type TPWConsoleMsgEvt = {
  text:string
  location:string
  type:EPWConsoleMethod|TPWConsoleMethods
}