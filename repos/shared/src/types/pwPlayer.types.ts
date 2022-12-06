import type { Player } from '@gobletqa/screencast'
import type {
  TRepo,
  TBrowser,
  TFileModel,
  TBrowserPage,
  TBrowserContext,
} from './index'

export type TRunnerResult = {
  [key:string]:any
}

export type TPlayerEvent = {
  name:string
  message?:string
  isPlaying:boolean
  results?:TRunnerResult
}

export type TPlayerEventCB = (event:TPlayerEvent) => void

export type TPlayerCleanupCB = (player:Player) => void

export type TPlayerStartConfig = TPlayerConfig & {
  url:string
}

export type TPlayerConfig = {
  repo:TRepo
  browser:TBrowser
  page:TBrowserPage
  options:TPlayerOpts
  onEvent:TPlayerEventCB
  context:TBrowserContext
  onCleanup:TPlayerCleanupCB
}

export type TPlayerOpts = {
  file?: TFileModel
}