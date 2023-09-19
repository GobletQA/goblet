import type { FocusEvent } from 'react'
import type { TExamUIRun } from '@types'
import type { TModalAction } from '@gobletqa/components'

import { useState } from 'react'
import { runExam } from '@actions/exam/runExam'
import { exists, flatUnion, noOp, toBool, toNum } from '@keg-hub/jsutils'
import {toggleModal} from '@actions/modals/toggleModal'
import {
  colors,
  CloseIcon,
  PlayCircleOutlineIcon,
} from '@gobletqa/components'
import {
  TagsInput,
  NumberInput,
  ToggleInput,
  InputContainer,
  InputHelperText,
  ExamCfgContainer,
  OptionsContainer,
  TestActionsFooter,
  TestOptsHeaderTitle,
  TestOptsHeaderContainer,
} from './ExamRun.styled'

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

export type TExamRun = {
  
}


const ExamRunActions:TModalAction[] = [
  {
    color: `error`,
    text: `Cancel`,
    variant: `contained`,
    StartIcon: CloseIcon,
    sx: { marginRight: `12px`, minWidth: `100px` },
    onClick: () => toggleModal(false),
  },
  {
    text: `Run`,
    color: `success`,
    keyboard: `enter`,
    variant: `contained`,
    StartIcon: PlayCircleOutlineIcon,
    iconProps: {
      sx: { color: colors.white },
    },
    sx: { color: colors.white, minWidth: `100px` },
    onClick: async (...args:any) => {
      await runExam()
    },
  }
]

const ExamUpdaters = {
  tags: {
    onBlur: (evt:FocusEvent, examCfg:TExamUIRun) => {
      const value = (evt.target as HTMLInputElement).value || ``
      if(!value) return undefined

      const formatted = value.split(` `)
        .reduce((tags, item) => {
          const cleaned = item.trim()
          if(!cleaned) return tags

          const tag = cleaned.startsWith(`@`) ? cleaned : `@${cleaned}`
          !tags.includes(tag) && tags.push(tag)
          
          return tags
        }, [] as string[])

      const tags = flatUnion(examCfg.tags, formatted)

      return { tags }
    },
    onChange: (
      evt:any,
      value:string|string[],
      reason:string,
      opt:any,
      examCfg:TExamUIRun
    ) => {
      return reason === `removeOption`
        ? { tags: value }
        : undefined
    }
  },
  testBail: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const testBail = toNum(value)
      return testBail > -1 ? { testBail } : undefined
    },
  },
  testRetry: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const testRetry = toNum(value)
      return testRetry > -1 ? { testRetry } : undefined
    },
  },
  suiteRetry: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const suiteRetry = toNum(value)
      return suiteRetry > -1 ? { suiteRetry } : undefined
    },
  },
  exitOnFailed: {
    onChange: (_:any, value:string, __:any, ___:any) => {
      if(!exists(value)) return undefined

      return { exitOnFailed: toBool(value) }
    },
    onBlur: noOp,
  },
  slowMo: {
    onChange: noOp,
    onBlur: (evt:FocusEvent) => {
      const value = (evt.target as HTMLInputElement).value
      if(!value) return undefined

      const slowMo = toNum(value)
      return slowMo > -1 ? { slowMo } : undefined
    },
  },
  
}

const useExamCfg = () => {
  // TODO: load the locally stored settings and add to the config as defaults
  
  const [examCfg, setExamCfg] = useState<TExamUIRun>({})
  return {
    examCfg,
    setExamCfg
  }
}

export const ExamRun = (props:TExamRun) => {
  const {
    examCfg,
    setExamCfg
  } = useExamCfg()

  const onBlurExam = (evt:FocusEvent, type:keyof typeof ExamUpdaters) => {
    const resp = ExamUpdaters[type]?.onBlur?.(evt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  }

  const onChangeExam = (args:any[], type:keyof typeof ExamUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = ExamUpdaters[type]?.onChange?.(evt, value, reason, opt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  }

  return (
    <>
      <ExamCfgContainer>
        <TestOptsHeaderContainer className='gb-exam-test-options-header' >
          <TestOptsHeaderTitle className='gb-exam-test-options-header-title' >
            Test Options
          </TestOptsHeaderTitle>
        </TestOptsHeaderContainer>

        <OptionsContainer>
          <InputContainer className='gb-exam-tags-input-container' >
            <TagsInput
              freeSolo={true}
              multiple={true}
              className='gb-exam-tags-input'
              onBlur={(evt) => onBlurExam(evt, `tags`)}
              onChange={(...args:any[]) => onChangeExam(args, `tags`)}
              label={`Tag Filter`}
              placeholder={`@whitelist   @passing   @user-auth  ...`}
              value={examCfg.tags || []}
              helperText={
                <InputHelperText>
                  Set one or multiple tags to filter which tests will be executed.
                </InputHelperText>
              }
            />
          </InputContainer>
          <InputContainer className='gb-exam-test-retry-input-container' >
            <NumberInput
              type='number'
              label='Step Retry'
              name='exam-test-retry-input'
              defaultValue={0}
              className='gb-exam-test-retry'
              helperText={
                <InputHelperText>
                  Amount of times to retry a step if it fails
                </InputHelperText>
              }
              placeholder='Enter the step retry amount... ( default: 0 )'
              onBlur={(evt) => onBlurExam(evt, `testRetry`)}
            />
          </InputContainer>
          <InputContainer className='gb-exam-suite-retry-input-container' >
            <NumberInput
              type='number'
              label='Feature Retry'
              name='exam-suite-retry-input'
              defaultValue={0}
              className='gb-exam-suite-retry'
              helperText={
                <InputHelperText>
                  Amount of times to retry a Feature if it fails.
                </InputHelperText>
              }
              placeholder='Enter the Feature retry amount... ( default: 0 )'
              onBlur={(evt) => onBlurExam(evt, `suiteRetry`)}
            />
          </InputContainer>

          <InputContainer className='gb-exam-bail-input-container' >
            <NumberInput
              type='number'
              label='Test Bail'
              name='exam-bail-input'
              defaultValue={5}
              className='gb-exam-test-bail'
              helperText={
                <InputHelperText>
                  Stop executing tests after a specified number of tests have failed.
                </InputHelperText>
              }
              placeholder='Enter a test bail amount... ( default: 5 )'
              onBlur={(evt) => onBlurExam(evt, `testBail`)}
            />
          </InputContainer>

          <InputContainer className='gb-exam-suite-retry-input-container' >
            <ToggleInput
              label='Exit on Fail'
              value={exists(examCfg.exitOnFailed) ? `${examCfg.exitOnFailed}` : `false`}
              onChange={(...args) => onChangeExam(args, `exitOnFailed`)}
              options={[
                { value: `true`, text: `True` },
                { value: `false`, text: `False` },
              ]}
              helperText={
                <InputHelperText>
                  Stop executing tests if a test fails. Same as setting <b>Test Bail</b> to <b>1</b>
                </InputHelperText>
              }
            />
          </InputContainer>


        </OptionsContainer>


        <TestOptsHeaderContainer className='gb-exam-browser-options-header' >
          <TestOptsHeaderTitle className='gb-exam-browser-options-header-title' >
            Browser Options
          </TestOptsHeaderTitle>
        </TestOptsHeaderContainer>

        <OptionsContainer>

          <InputContainer className='gb-exam-slowmo-container' >
            <NumberInput
              type='number'
              defaultValue={100}
              label='Browser Speed'
              name='exam-browser-slowmo'
              className='gb-exam-slowmo-input'
              onBlur={(evt) => onBlurExam(evt, `testBail`)}
              helperText={
                <InputHelperText>
                  Speed in which browser actions are executed, a.k.a &nbsp;<b>"slow-mo"</b>
                </InputHelperText>
              }
              placeholder='Enter the browser speed... ( default: 100 )'
            />
          </InputContainer>

        </OptionsContainer>

      </ExamCfgContainer>

      <TestActionsFooter
        actions={ExamRunActions}
      />
    </>
  )
}

