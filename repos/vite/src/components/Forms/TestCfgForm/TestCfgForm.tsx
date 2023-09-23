import type { TExamUIRun, TOnBlurTestCfg, TOnChangeTestCfg } from '@types'

import { TestOpts } from './TestOpts'
import { BrowserOpts } from './BrowserOpts'
import { TestCfgContainer } from './TestCfgForm.styled'

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


export type TTestCfgForm = {
  testRunCfg:TExamUIRun
  onBlurTestCfg:TOnBlurTestCfg
  onChangeTestCfg:TOnChangeTestCfg
}

export const TestCfgForm = (props:TTestCfgForm) => {
  return (
    <>
      <TestCfgContainer>
        <TestOpts {...props} />
        <BrowserOpts {...props} />
      </TestCfgContainer>
    </>
  )
}

