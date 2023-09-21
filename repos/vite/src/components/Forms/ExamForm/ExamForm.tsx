import type { TModalAction } from '@gobletqa/components'
import type { TExamUIRun, TOnBlurExam, TOnChangeExam } from '@types'

import { TestOpts } from './TestOpts'
import { BrowserOpts } from './BrowserOpts'
import {
  ExamCfgContainer,
  TestActionsFooter,
} from './ExamForm.styled'

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


export type TExamForm = {
  examCfg:TExamUIRun
  onBlurExam:TOnBlurExam
  onChangeExam:TOnChangeExam
  actions:TModalAction[]
}

export const ExamForm = (props:TExamForm) => {
  const { actions, ...rest } = props

  return (
    <>
      <ExamCfgContainer>
        <TestOpts {...rest} />
        <BrowserOpts {...rest} />
      </ExamCfgContainer>
      <TestActionsFooter actions={actions} />
    </>
  )
}

