import type { ETestType } from './tests.types'
import type { EBrowserName, EBrowserType } from './browser.types'
export type { TStepCtx } from '../../../testify/src/types/goblet.types'
export type { VideoRecorder } from '../../../testify/src/playwright/video'
export type { TraceRecorder } from '../../../testify/src/playwright/tracer'


export type TGobletTestArtifactOption = `never` | `always` | `on-fail` | true | false | 1 | 0

export type TGobletTestStatus = `passed` | `failed`

export type TGobletTestTracingOpts = {
  sources?:boolean
  snapshots?:boolean
  screenshots?:boolean
}

export type TGobletTestOpts = {
  tracesDir?:string
  videosDir?:string
  reportsDir?:string
  uploadsDir?:string
  downloadsDir?:string
  reusePage?:boolean
  snapshotsDir?:string
  reuseContext?:boolean
  testType?:string|false
  browserDisabled?:boolean
  htmlCombineAllTests?:boolean
  tracing?:TGobletTestTracingOpts
  saveVideo?:TGobletTestArtifactOption
  saveTrace?:TGobletTestArtifactOption
  saveReport?:TGobletTestArtifactOption
  saveScreenshot?:TGobletTestArtifactOption
}

export type TBuildTestGobletOptsParams = Partial<TGobletTestOpts> & {}

export type TBuildTestArgs = {
  base?:string
  testCI?:boolean
  context?:string
  testMatch?:string
  noTests?:boolean
  testSync?:boolean
  testDebug?:boolean
  testConfig?:string
  testCache?:boolean
  testWorkers?:number
  testTimeout?:number
  testColors?:boolean
  testVerbose?:boolean
  suiteTimeout?:number
  exitOnFailed?:boolean
  testBail?:number|boolean
  testRetry?:boolean|number
  suiteRetry?:boolean|number
  skipAfterFailed?:boolean
}


export type TBuildPWEnvs = {
  nodeEnv?:string
  width?:number
  height?:number
  slowMo?:number
  headless?:boolean
  timezone?:string
  hasTouch?:boolean
  isMobile?:boolean
  devtools?:boolean
  downloads?:boolean
  reusePage?:boolean
  screenshot?:boolean
  testDebug?:boolean
  debugBrowser?:string
  htmlCombine?:boolean
  reuseContext?:boolean
  browserTimeout?:number
  devices?:string|string[]
  permissions?:string|string[]
  video?:TGobletTestArtifactOption
  browser?:EBrowserName|EBrowserType
  tracing?:TGobletTestArtifactOption
  testReport?:TGobletTestArtifactOption
  geolocation?:string|string[]|number[]
}

export type TBuildBddEnvs = TBuildPWEnvs & {
  cwd?:string
  base?:string
  filter?:string
  type?:ETestType
  gobletToken?:string
  tags?:string|string[]
  browser?:EBrowserName|EBrowserType
}