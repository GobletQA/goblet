import type { TBrowserContext, TBrowserPage, TBrowser } from './pw.types'


export type TPWOnRecordCleanup = (...args:any[]) => void

export type TPWRecordEvent = {
  name?:string
  message?:string
  [key:string]: any
}

export type TPWRecordConfig = {
  url?:string
  page?:TBrowserPage
  browser?:TBrowser
  context?:TBrowserContext
  options?:Record<any, any>
  onEvent?:TPWOnRecordEvent
  onCleanup?:TPWOnRecordCleanup
  disableClick?:boolean
  highlightStyles?:Record<string, string|number>,
}

export type TPWRecordOptions = {
  disableClick:boolean
  highlightStyles:Record<string, string|number>,
  [key:string]: any
}

export type TPWOnRecordEvent = (event:TPWRecordEvent) => void
