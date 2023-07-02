import type { Express } from 'express'

// Exported from screencast/src/types
import type { TRepo } from './repo.types'
import type { TFileModel } from './models.types'
import type { EBrowserType } from './browser.types'
import type { TParkinRunStepOptsMap, TWorldConfig } from '@ltipton/parkin'
import type { Automate } from '@gobletqa/screencast'
import type { TSocketEvtCBProps } from './socket.types'
import type { TAutomateEvent } from './pwAutomate.types'
import type {
  Page,
  Locator,
  Browser,
  Geolocation,
  ViewportSize,
  LaunchOptions,
  BrowserServer,
  BrowserContext,
  BrowserContextOptions,
} from 'playwright'

/**
 * This is an internal playwright property
 * So every time playwright is updated, we need to ensure it still exists on the components
 */
export type TWithGuid = {
  _guid?:string
}

export type TLocatorOpts = {
  has?: TLocator
  hasText?: string|RegExp
}

export type TLocatorClickOpts = Parameters<Locator[`click`]>[`0`] & {
  maxTries?:number
  moveDelay?:number
  moveSpeed?:number
}

export type TLocator = Omit<Locator, `click`> & {
  click: (options:TLocatorClickOpts) => Promise<void>
}

export type TBrowser = Omit<Browser, `newContext`> & TWithGuid & {
  newContext:(options?: TBrowserContextOpts) => Promise<TBrowserContext>
}

export type TBrowserContext = Omit<BrowserContext, `newPage`|`pages`> & TWithGuid & {
  pages: () => Array<TBrowserPage>
  newPage: () => Promise<TBrowserPage>
  __GobletAutomateInstance?: Automate
  __goblet?: {
    cookie?:string
    tracing?:Boolean
    extraHTTPHeaders?:Record<string, string>
    options?:Partial<BrowserContextOptions>
    [key:string]: any
  }
}

export type TBrowserPage = Omit<Page, `locator`> & TWithGuid & {
  locator:(selector: string, options?: TLocatorOpts) => TLocator
  __GobletAutomateInstance?: Automate
}

export type TScreenDims = ViewportSize
export type TBrowserServer = BrowserServer
export type TBrowserContextGeo = Geolocation
export type TBrowserLaunchOpts = LaunchOptions
export type TBrowserContextOpts = BrowserContextOptions
export type TColorSchema = null | `light` | `dark` | `no-preference`
export type TBrowserType = `chromium` | `firefox` | `webkit` | string
 
 export type TContextStorageState = ReturnType<TBrowserContext[`storageState`]>
 
export type TBrowserTraceStartOpts = {
  path?: string;
  categories?: string[]
  screenshots?: boolean;
}
export type TStartTraceOpts = {
  name?: string
  screenshots?: boolean
  snapshots?: boolean
  sources?: boolean
  title?: string
}

export type TStopTraceOpts = {
  path?: string
}

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
  page:TPageOpts
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
  context?: TBrowserContext
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

export type TBrowserActionResp = unknown

export type TBrowserActionOptions = {
  cmd?: string
  params?:string[]
  file?: Partial<TFileModel>
  playOptions?: Record<string, string|number|boolean>
  recordOptions?: Record<string, string|number|boolean>
}

export type TBrowserAction = {
  ref?: TPWComponentRef
  prev?: string | boolean
  action?: string | TActionCallback
  props?: [TBrowserActionOptions, string]
}

export type TSetBrowserDefaults = {
  repo:TRepo,
  url?:boolean
  headers?:boolean
  browserConf:TBrowserConf
  pwComponents?:TPWComponents
}

export type TStartPlaying = {
  id:string,
  repo:TRepo,
  action:TBrowserAction,
  onEvent:TActionCallback
  onCleanup:TActionCallback
  browserConf: TBrowserConf
  pwComponents?:TPWComponents
  steps?:TParkinRunStepOptsMap
}

export type TStartRecording = {
  id:string,
  repo?:TRepo,
  action:TBrowserAction,
  onCleanup?:TActionCallback
  browserConf: TBrowserConf
  pwComponents?: TPWComponents
  onRecordEvent:TActionCallback
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
export type TBrowserEventArgs = Pick<
  TSocketEvtCBProps, `socket`|`Manager`
> & { 
  browser?:TBrowserConf
  pwComponents?: TPWComponents
}

export type TBrowserEvents = {
  [key in EBrowserEvent]?: TBrowserEventCB|TBrowserEventCB[]
}

export type TOnBrowserEvents = {
  events:TBrowserEvents
  browserConf?: TBrowserConf
  pwComponents?: TPWComponents
  automateEvent?: (event:TAutomateEvent) => void
}
