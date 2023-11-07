import type { Automate } from '@gobletqa/browser'
import type { TBrowserEventArgs, TBrowserConf, TBrowserContext, TBrowserPage } from './pw.types'

export type TAutomateEventData<T=Record<string, any>> = T

export type TAutomateEvent<T=Record<string, any>> = {
  name:string
  message?:string
  data?:TAutomateEventData<T>
}

export type TAutomateOpts = {
  highlightStyles: Record<string, string|number>
}

export type TUserAutomateOpts = {
  browser?:TBrowserConf
  selectorType?: string
  disabledEvents?:boolean
  selectorRef?:string|string[]
}

export type TAutomateCleanupCB = (automate:Automate) => void

export type TOnAutomateEvent = <T>(event:TAutomateEvent<T>, args?:TBrowserEventArgs) => void

export type TPageOrContext = TBrowserPage | TBrowserContext

export type TAutomateParent = TPageOrContext & {
  __GobletAutomateInstance: Automate
}

export type TAutomateConfig = {
  options?:TAutomateOpts
  onEvent?:TOnAutomateEvent
  onCleanup?:TAutomateCleanupCB
  parent:TAutomateParent|TPageOrContext
}

export type TAutomatePageEvent = {
  url?:string
}

export type TAutomateElementEvent = TAutomatePageEvent & {
  key?:string
  type?:string
  target?:string
  elementHtml?:string
  elementText?:string
  elementTag?:string
  elementType?:string
  selectedText?:string
  selectedIndex?:number
  elementChecked?:boolean
}
