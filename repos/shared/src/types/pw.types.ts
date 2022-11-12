import type { TRepo } from './repo.types'
import type {
  Page,
  Browser,
  Geolocation,
  ViewportSize,
  LaunchOptions,
  BrowserServer,
  BrowserContext,
  BrowserContextOptions,
} from 'playwright'

export type TBrowser = Browser
export type TBrowserPage = Page
export type TScreenDims = ViewportSize
export type TBrowserServer = BrowserServer
export type TBrowserContext = BrowserContext
export type TBrowserContextGeo = Geolocation
export type TBrowserLaunchOpts = LaunchOptions
export type TBrowserContextOpts = BrowserContextOptions
export type TColorSchema = null | `light` | `dark` | `no-preference`
export type TBrowserType = `chromium` | `firefox` | `webkit` | string

export type TBrowserContextVideo = {
  dir: string;
  size?: TScreenDims
}

export type TPageOpts = {
  [key:string]: any
}

export type TBrowserConf = TBrowserLaunchOpts & {
  type: TBrowserType
  ws?: boolean
  url?:string
  page: TPageOpts
  restart?:boolean
  colorScheme?: TColorSchema
  context?:TBrowserContextOpts
}

export type TBrowserStatus = {
  err?: string
  message?: string,
  running: boolean,
  status: string|boolean,
}

export type TPWComponentRef = `browser` | `context` | `page` | string
export type TPWComponent = TBrowser | TBrowserContext | TBrowserPage
export type TPWComponents = {
  browser: TBrowser
  page: TBrowserPage
  context: TBrowserContext
  status?: TBrowserStatus
}

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
  pwComponents:TPWComponents
  onPlayEvent:TActionCallback
  onCreateNewPage:TActionCallback
}

export type TStartRecording = {
  id:string,
  repo?:TRepo,
  action:TBrowserAction,
  onCleanup?:TActionCallback
  browserConf: TBrowserConf
  pwComponents: TPWComponents
  onRecordEvent:TActionCallback
  onCreateNewPage?:TActionCallback
}

export type TBrowserMetaDataContext = {
  type:string,
  endpoint:string
  launchTime: string
  browserConf:TBrowserConf
}

export type TBrowserMetaData = {
  chrome?:TBrowserMetaDataContext
  webkit?:TBrowserMetaDataContext
  firefox?:TBrowserMetaDataContext
  chromium?:TBrowserMetaDataContext
}