import type {
  TBrowser,
  TGBWorldCfg,
  TBrowserConf,
  EBrowserName,
  TPWComponents,
  TGobletConfig,
} from '@gobletqa/shared/types'

type TGetBrowserOpts = {
  browserServer?:boolean,
}

export type TStartBrowser = {
  world?:TGBWorldCfg
  initialUrl?:string
  config?:TGobletConfig
  browserServer?:boolean,
  _isLoopedCalled?:boolean
  _loopedType?:EBrowserName
  browserConf?:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export type TGetPWComponents = {
  world?:TGBWorldCfg
  initialUrl?:string
  config?:TGobletConfig
  browserConf?:TBrowserConf
}

export type TBrowserOnly = {
  world?:TGBWorldCfg
  config?:TGobletConfig
  browserServer?:boolean
  browserConf?:TBrowserConf
}

export type TGetPage = TGetPWComponents & {
  overrides?:Partial<TBrowserConf>
}
export type TGetPageCB = ((props:TGetPage) => Promise<TPWComponents>) & {
  creatingPage:boolean
}

export type TGetCtx = {
  world?:TGBWorldCfg
  config?:TGobletConfig
  browserConf:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export type TPWBrowsersOpts = {
  browsers:Record<EBrowserName, TBrowser>
}

export type TCreateBrowserOpts = {
  type:EBrowserName
  world?:TGBWorldCfg
  config?:TGobletConfig
  browserConf:TBrowserConf
}

export type TGetBrowser = {
  world?:TGBWorldCfg
  opts?:TGetBrowserOpts
  config?:TGobletConfig
  browserConf:TBrowserConf
}
