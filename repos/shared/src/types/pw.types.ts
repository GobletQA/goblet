import type { TRepo } from './repo.types'

export type TBrowserType = `chrome` | `chromium` | `firefox` | `webkit` | string

export type TContextEvtCallback = (...args:any[]) => void

export type TScreenDims = {
  width: number,
  height: number,
}

export type TBrowserPage = {
  [key:string]: any
}

export type TPageOpts = {
  [key:string]: any
}

export type TBrowserContext = {
  screen: TScreenDims,
  viewport: TScreenDims,
  newPage: (page:TPageOpts) => TBrowserPage
  on: (event:string, callback:TContextEvtCallback) => void
}

export type TBrowserContextGeo = {
  latitude:string
  longitude:string
  accuracy:number
}

export type TBrowserContextOpts = {
  hasTouch?:boolean
  isMobile?:boolean
  timezoneId?:string
  screen?:TScreenDims
  viewport?:TScreenDims
  acceptDownloads?:boolean
  geolocation?: TBrowserContextGeo
  [key:string]: any
}

export type TBrowser = {
  [key:string]: any
}

export type TBrowserConf = {
  type: TBrowserType
  ws?: boolean
  url?:string
  args?:string[]
  page: TPageOpts
  slowMo?: number
  channel?:string
  restart?:boolean
  headless?:boolean,
  config:Record<any, any>
  context?:TBrowserContextOpts
}

export type TPWComponentRef = `browser` | `context` | `page` | string
export type TPWComponent = TBrowser | TBrowserContext | TBrowserPage

export type TActionCallback = (...args:any[]) => void

export type TBrowserActionArgs = {
  id:string
  ref:TPWComponentRef
  actions:TBrowserAction[]
  onRecordEvent?:TActionCallback
}

export type TBrowserAction = {
  props?: any[]
  ref?: TPWComponentRef
  prev?: string | boolean
  action?: string | TActionCallback
}

export type TStartPlaying = {
  id:string,
  repo:TRepo,
  action:TBrowserAction,
  onCleanup:TActionCallback
  browserConf: TBrowserConf
  pwComponents:TPWComponent
  onPlayEvent:TActionCallback
  onCreateNewPage:TActionCallback
}

export type TStartRecording = {
  id:string,
  repo?:TRepo,
  action:TBrowserAction,
  onCleanup?:TActionCallback
  browserConf: TBrowserConf
  pwComponents:TPWComponent
  onRecordEvent:TActionCallback,
  onCreateNewPage?:TActionCallback
}

export type TBrowserMetaDataContext = {
  type:string,
  endpoint:string
  launchTime: string
  launchOptions:TBrowserConf
}

export type TBrowserMetaData = {
  chrome?:TBrowserMetaDataContext
  webkit?:TBrowserMetaDataContext
  firefox?:TBrowserMetaDataContext
  chromium?:TBrowserMetaDataContext
  [key:string]: any
}