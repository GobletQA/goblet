import type { TBrowserConf, TBrowserType } from './pw.types'

export type TGetBrowsers = {
  webkit:boolean
  firefox:boolean
  chromium:boolean
  allBrowsers:boolean,
  browsers:string|string[]
}

export enum EBrowserName {
  webkit=`webkit`,
  firefox=`firefox`,
  chromium=`chromium`,
}

export enum EBrowserType {
  ch=`chromium`,
  chrome=`chromium`,
  chromium=`chromium`,
  fr=`firefox`,
  firefox=`firefox`,
  wk=`webkit`,
  safari=`webkit`,
  webkit=`webkit`,
}

export type TBrowserLaunchParams = TGetBrowsers & TBrowserConf & {
  log:boolean
  headless:boolean
  allowed:TBrowserType[]
}

export type TBrowserDebuggerCfg = {
  id:string
  url:string
  title:string
  faviconUrl:string
  description:string
  type:`page`|`browser`
  devtoolsFrontendUrl:string
  webSocketDebuggerUrl:string
}