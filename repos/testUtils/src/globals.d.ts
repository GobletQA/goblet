import type { TJasmine, TJasmineEnv } from '@ltipton/parkin'
import type {
  TGobletConfig,
  TGobletTestOpts,
  TGobletTestGlobal,
  TGobletGlobalContext,
  TGobletGlobalBrowser,
} from './types'


declare global {
  interface __goblet {
    config: TGobletConfig
    options:TGobletTestOpts
    context:TGobletGlobalContext
    browser:TGobletGlobalBrowser
  }
}

export default global;
