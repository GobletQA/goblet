import type { TRepo } from './repo.types'
import type { TSocketMessageObj } from './socket.types'
import type { TBrowserActionOptions, TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

// Exported from screencast/src/types
import type { Recorder } from '@gobletqa/screencast'


export type TPWOnRecordCleanup = (...args:any[]) => void

export type TPWRecordEvent = {
  [key:string]: any
}
export type TPWRecordConfig = {
  disableClick:boolean
  highlightStyles:Record<string, string|number>,
  [key:string]: any
}

export type TPWRecordOptions = {
  disableClick:boolean
  highlightStyles:Record<string, string|number>,
  [key:string]: any
}

export type TPWOnRecordEvent = (event:TPWRecordEvent) => void
