// TODO: this file should probably be moved to screencast repo
// It is screencast specific

import type { TRepo } from './repo.types'
import type { TFileModel } from './models.types'
import type { Player } from '@gobletqa/screencast'
import type { TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

export type TRunnerResult = {
  [key:string]:any
}

export type TPlayerEvent = {
  name:string
  message?:string
  isPlaying:boolean
  data?:TRunnerResult | Record<string, any>
}

export type TPlayerEventCB = (event:TPlayerEvent) => void

export type TPlayerCleanupCB = (player:Player) => void

export type TPlayerConfig = {
  repo?:TRepo
  browser?:TBrowser
  page?:TBrowserPage
  options?:TPlayerOpts
  onEvent?:TPlayerEventCB
  context?:TBrowserContext
  onCleanup?:TPlayerCleanupCB
}

export type TPlayerStartConfig = TPlayerConfig & {
  url:string
}


export type TPlayerOpts = {
  file?: TFileModel
}