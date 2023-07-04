import type {TWorldConfig} from '@ltipton/parkin'
import type { BrowserContextOptions } from 'playwright'
import type { TLocator, TBrowserPage, TGobletTestOpts } from './shared.types'


export type TGobletGlobalRecordVideo = {
  dir?:string
}

export type TGobletGlobalContextOpts = Partial<BrowserContextOptions>

export type TGobletGlobalContext = {
  options: TGobletGlobalContextOpts
}

export type TGobletGlobalBrowserOpts = {
  type?:string
  tracesDir?:string
}

export type TGobletGlobalBrowser = {
  options: TGobletGlobalBrowserOpts
}

export type TGobletTestGlobal = {
  options:TGobletTestOpts
  context: TGobletGlobalContext
  browser: TGobletGlobalBrowser
}

export type TGetLocationOpts = {
  waitFor?:boolean
  page?: TBrowserPage
}

export type TLocatorMapMethod = (
  page:TBrowserPage,
  selector:string
) => Promise<TLocator>

export type TLocatorTypeMap = {
  role: TLocatorMapMethod
  text: TLocatorMapMethod
  title: TLocatorMapMethod
  label: TLocatorMapMethod
  placeholder: TLocatorMapMethod
}

export type TStepCtx = {
  world:TWorldConfig
  [key:string]: any
}
