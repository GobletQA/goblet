import { TLocator, TBrowserPage, TGobletTestOpts } from './shared.types'

export type TGobletGlobalRecordVideo = {
  dir?:string
}

export type TGobletGlobalContextOpts = {
  recordVideo?: TGobletGlobalRecordVideo
}

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