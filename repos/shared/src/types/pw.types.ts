import type { TRepo } from './repo.types'
import type { EBrowserType } from './browser.types'
import type {
  Page,
  Frame,
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
  type: EBrowserType
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

export type TPWBrowser = {
  browser: TBrowser
}

export type TPWComponents = TPWBrowser & {
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
  onEvent:TActionCallback
  onCleanup:TActionCallback
  browserConf: TBrowserConf
  pwComponents?:TPWComponents
  onCreateNewPage:TActionCallback
}

export type TStartRecording = {
  id:string,
  repo?:TRepo,
  action:TBrowserAction,
  onCleanup?:TActionCallback
  browserConf: TBrowserConf
  pwComponents?: TPWComponents
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

export enum EBrowserEvent {
  close='close',
  console='console',
  crash='crash',
  dialog='dialog',
  domcontentloaded='domcontentloaded',
  download='download',
  filechooser='filechooser',
  frameattached='frameattached',
  framedetached='framedetached',
  framenavigated='framenavigated',
  load='load',
  pageerror='pageerror',
  popup='popup',
  request='request',
  requestfailed='requestfailed',
  requestfinished='requestfinished',
  response='response',
  websocket='websocket',
  worker='worker',
}

export type TBrowserEventCB = (...args:any[]) => void

export type TBrowserEvents = {
  [key in EBrowserEvent]?: TBrowserEventCB[]
}

export type TOnBrowserEvents = {
  events:TBrowserEvents
  browserConf?: TBrowserConf
  pwComponents?: TPWComponents
}
