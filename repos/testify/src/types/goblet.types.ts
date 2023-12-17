import type { BrowserContextOptions } from 'playwright'
import type {TStepAst, TStepTable } from '@ltipton/parkin'
import type { TGBWorldCfg, TGobletConfig, TLocator, TBrowserPage, TGobletTestOpts } from './shared.types'


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
  config: TGobletConfig
  context: TGobletGlobalContext
  browser: TGobletGlobalBrowser
}

export type TGetLocationOpts = {
  waitFor?:boolean
  page?: TBrowserPage
}

export type TLocByText = {
  exact?:boolean
}

export type TLocByRole = TLocByText & {
  level?:number
  pressed?:boolean
  selected?:boolean
  expanded?:boolean
  name?:string|RegExp
  includeHidden?:boolean
}

export type TLocatorMapMethod<Opts extends Record<string, any>=TLocByText> = (
  page:TBrowserPage,
  selector:string,
  options?:Opts
) => Promise<TLocator>


export type TLocatorTypeMap = {
  role: TLocatorMapMethod<TLocByRole>
  text: TLocatorMapMethod
  title: TLocatorMapMethod
  label: TLocatorMapMethod
  placeholder: TLocatorMapMethod
}

export type TStepCtx = {
  doc?: any
  step:TStepAst
  table?:TStepTable
  world:TGBWorldCfg
  options?:Record<string, any>
  [key:string]: any
}
