
import type { Repo, TGobletConfig } from './repo.types'
import type { TFileModel } from './models.types'
import type { Automate } from '@gobletqa/browser'
import type { TSocketEvtCBProps } from './socket.types'
import type { TAutomateEvent } from './pwAutomate.types'
import type { TParkinRunStepOptsMap } from '@ltipton/parkin'
import type { EBrowserName, EBrowserType } from './browser.types'
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
 * _guid is an internal playwright property
 * So every time playwright is updated, we need to ensure it still exists on the components
 */
export type TWithGuid = {
  _guid?:string
  __browserGoblet?:TBrowserConf
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

export type TLocator = Locator & {
  // Click handler for ghost cursor, which is currently disabled
  // ghClick: (options:TLocatorClickOpts) => Promise<void>
}

export type TBrowser = Omit<Browser, `newContext`> & TWithGuid & {
  newContext:(options?: TBrowserContextOpts) => Promise<TBrowserContext>
}

export type TBrowserContext = Omit<BrowserContext, `newPage`|`pages`> & {
  _guid?:string
  pages: () => Array<TBrowserPage>
  newPage: () => Promise<TBrowserPage>
  __GobletAutomateInstance?: Automate
  __contextGoblet?: {
    tracer?:any
    cookie?:string
    tracing?:Boolean
    extraHTTPHeaders?:Record<string, string>
    options?:Partial<TBrowserContextOpts>
  }
}

export type TBrowserPage = Omit<Page, `locator`> & TWithGuid & {
  locator:(selector: string, options?: TLocatorOpts) => TLocator
  __GobletAutomateInstance?: Automate
  __pageGoblet?: {
    video?:any
  }
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
  ws?: boolean
  url?:string
  page?:TPageOpts
  restart?:boolean
  colorScheme?: TColorSchema
  context?:TBrowserContextOpts
  type: EBrowserType|EBrowserName
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

export type TPWComponents = Omit<TPWBrowser, `context`> & {
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
  repo:Repo
  headers?:boolean
  url?:boolean|string
  config:TGobletConfig
  browserConf:TBrowserConf
  pwComponents?:TPWComponents
}

export type TStartPlaying = {
  id:string
  repo:Repo
  action:TBrowserAction,
  onEvent:TActionCallback
  onCleanup:TActionCallback
  browserConf: TBrowserConf
  pwComponents?:TPWComponents
  steps?:TParkinRunStepOptsMap
}

export type TStartRecording = {
  id:string
  repo?:Repo
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
  close=`close`,
  console=`console`,
  crash=`crash`,
  dialog=`dialog`,
  domcontentloaded=`domcontentloaded`,
  download=`download`,
  filechooser=`filechooser`,
  frameattached=`frameattached`,
  framedetached=`framedetached`,
  framenavigated=`framenavigated`,
  load=`load`,
  pageerror=`pageerror`,
  popup=`popup`,
  request=`request`,
  requestfailed=`requestfailed`,
  requestfinished=`requestfinished`,
  response=`response`,
  websocket=`websocket`,
  worker=`worker`,
}

export type TBrowserEventCB = (...args:any[]) => void
export type TBrowserEventArgs = Pick<
  TSocketEvtCBProps, `socket`|`Manager`
> & { 
  browserConf?:TBrowserConf
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
