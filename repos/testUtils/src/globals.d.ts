import type {
  TBrowser,
  TBrowserPage,
  TGobletConfig,
  TGobletTestOpts,
  TBrowserContext,
  TGobletTestGlobal,
  TGobletGlobalContext,
  TGobletGlobalBrowser,
} from './types'


declare global {
  type browser = TBrowser
  type context = TBrowserContext

  interface __goblet {
    config: TGobletConfig
    options:TGobletTestOpts
    context:TGobletGlobalContext
    browser:TGobletGlobalBrowser
  }

}

export default global;
