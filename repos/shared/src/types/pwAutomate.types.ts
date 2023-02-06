import type { TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

// Exported from screencast/src/types
import type { Automate } from '@gobletqa/screencast'

export type TAutomateEventData<T=Record<string, any>> = T

export type TAutomateEvent<T=Record<string, any>> = {
  name:string
  message?:string
  data?:TAutomateEventData<T>
}

export type TAutomateOpts = {
  highlightStyles: Record<string, string|number>
}

export type TAutomateCleanupCB = (automate:Automate) => void

export type TOnAutomateEvent = <T>(event:TAutomateEvent<T>) => void

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
