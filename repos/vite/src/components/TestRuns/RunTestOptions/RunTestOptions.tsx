import type { TTestRunUICfg, TOnBlurRunTestOpts, TOnChangeRunTestOpts } from '@types'

import { TestOpts } from './TestOpts'
import { BrowserOpts } from './BrowserOpts'
import { RunTestOptsContainer } from './RunTestOptions.styled'

/**
 * Add rest of test and browser options

  width?:number
  height?:number
  headless?:boolean
  timezone?:string
  hasTouch?:boolean
  isMobile?:boolean
  devtools?:boolean
  downloads?:boolean
  reusePage?:boolean
  screenshot?:boolean
  debugBrowser?:string
  reuseContext?:boolean
  browserTimeout?:number
  devices?:string|string[]
  permissions?:string|string[]
  video?:TGobletTestArtifactOption
  browser?:EBrowserName|EBrowserType
  tracing?:TGobletTestArtifactOption
  testReport?:TGobletTestArtifactOption
  geolocation?:string|string[]|number[]

  type?:ETestType
  gobletToken?:string
  tags?:string|string[]
  browser?:EBrowserName|EBrowserType

 */


export type TRunTestOptions = {
  testRunCfg:TTestRunUICfg
  onBlurRunTestOpts:TOnBlurRunTestOpts
  onChangeRunTestOpts:TOnChangeRunTestOpts
}

export const RunTestOptions = (props:TRunTestOptions) => {
  return (
    <>
      <RunTestOptsContainer>
        <TestOpts {...props} />
        <BrowserOpts {...props} />
      </RunTestOptsContainer>
    </>
  )
}

