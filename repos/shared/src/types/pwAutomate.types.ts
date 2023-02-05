import type { TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

// Exported from screencast/src/types
import type { Automate } from '@gobletqa/screencast'

export type TAutomateEventData = Record<string, any>

export type TAutomateEvent = {
  name:string
  message?:string
  data?:TAutomateEventData
}

export type TAutomateOpts = {
  highlightStyles: Record<string, string|number>
}

export type TAutomateCleanupCB = (automate:Automate) => void

export type TOnAutomateEvent = (event:TAutomateEvent) => void


export type TAutomateConfig = {
  browser?:TBrowser
  page?:TBrowserPage
  context?:TBrowserContext
  onEvent?:TOnAutomateEvent
  onCleanup?:TAutomateCleanupCB
  options?:TAutomateOpts
}