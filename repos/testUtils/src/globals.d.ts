import type { TJasmine, TJasmineEnv } from '@ltipton/parkin'
import type {
  TGobletConfig,
  TGobletTestOpts,
  TGobletTestGlobal,
  TGobletGlobalContext,
  TGobletGlobalBrowser,
} from './types'


declare global {
  interface jasmine {
    testPath: string;
    getEnv: () => TJasmineEnv;
    [key: string]: any;
  }
  interface __goblet {
    config: TGobletConfig
    options:TGobletTestOpts
    context:TGobletGlobalContext
    browser:TGobletGlobalBrowser
  }
}

export default global;

export { }