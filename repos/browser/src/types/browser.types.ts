import type { TWorldConfig } from '@ltipton/parkin'
import type {
  TBrowser,
  TBrowserConf,
  EBrowserName,
  TPWComponents,
  TGobletConfig,
} from '@GBB/types'

type TGetBrowserOpts = {
  browserServer?:boolean,
}

export type TStartBrowser = {
  world?:TWorldConfig
  initialUrl?:string
  config?:TGobletConfig
  browserServer?:boolean,
  _isLoopedCalled?:boolean
  _loopedType?:EBrowserName
  browserConf?:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export type TGetPWComponents = {
  world?:TWorldConfig
  initialUrl?:string
  config?:TGobletConfig
  browserConf?:TBrowserConf
}

export type TBrowserOnly = {
  world?:TWorldConfig
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
  world?:TWorldConfig
  config?:TGobletConfig
  browserConf:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export type TPWBrowsersOpts = {
  browsers:Record<EBrowserName, TBrowser>
}

export type TCreateBrowserOpts = {
  type:EBrowserName
  world?:TWorldConfig
  config?:TGobletConfig
  browserConf:TBrowserConf
}

export type TGetBrowser = {
  world?:TWorldConfig
  opts?:TGetBrowserOpts
  config?:TGobletConfig
  browserConf:TBrowserConf
}
