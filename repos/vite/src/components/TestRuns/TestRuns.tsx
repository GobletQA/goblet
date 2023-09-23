import type { FocusEvent } from 'react'
import type { TModalAction } from '@gobletqa/components'
import type { TTestRunsState, TExamUIRun, TTestsGetUICfgEvt } from '@types'

import { useState } from 'react'
import { ETestRunsSection } from '@types'
import { PastTestRuns } from './PastTestRuns'
import { TestCfgUpdaters } from './TestCfgUpdaters'

import { TestRunsTabs } from './TestRunsTabs'
import { TestsGetUICfgEvt } from '@constants'
import { TestRunsReporter } from './TestRunsReporter'
import { TestCfgForm } from '@components/Forms/TestCfgForm'
import { useRepo, useSettings, useTestRuns } from '@store'
import { buildTestRunCfg } from '@utils/browser/buildTestRunCfg'
import {
  TestRunsHeader,
  TestActionsFooter,
  TestRunsContainer,
  TestRunsHeaderText,
} from './TestRuns.styled'

import {
  TestRunsRunAction,
  TestRunsAbortAction,
  TestRunsCancelAction,
} from './TestRunsActions'


import {
  useInline,
  useOnEvent,
} from '@gobletqa/components'

const useTestRunOpts = (testRuns:TTestRunsState) => {
  const repo = useRepo()
  const settings = useSettings()
  const cfg = buildTestRunCfg({ repo, settings })

  const [testRunCfg, setTestRunCfg] = useState<TExamUIRun>(cfg)

  return {
    testRunCfg,
    setTestRunCfg,
    actions: [
      testRuns.allTestsRunning ? TestRunsAbortAction : TestRunsCancelAction,
      TestRunsRunAction
    ] as TModalAction[],
  }
}

const SectionTabMap = {
  [ETestRunsSection.config]: () => null,
  [ETestRunsSection.runs]: PastTestRuns,
  [ETestRunsSection.reporter]: TestRunsReporter
}

export const TestRuns = () => {
  const testRuns = useTestRuns()
  
  const {
    actions,
    testRunCfg,
    setTestRunCfg
  } = useTestRunOpts(testRuns)

  const onBlurTestCfg = useInline((evt:FocusEvent, type:keyof typeof TestCfgUpdaters) => {
    const resp = TestCfgUpdaters[type]?.onBlur?.(evt, testRunCfg)
    resp && setTestRunCfg({...testRunCfg, ...resp })
  })

  const onChangeTestCfg = useInline((args:any[], type:keyof typeof TestCfgUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = TestCfgUpdaters[type]?.onChange?.(evt, value, reason, opt, testRunCfg)
    resp && setTestRunCfg({...testRunCfg, ...resp })
  })

  const [section, setSection] = useState<ETestRunsSection>(
    testRuns.allTestsRunning ? ETestRunsSection.reporter : ETestRunsSection.config
  )

  const onChangeSection = useInline((sec:ETestRunsSection) => sec !== section && setSection(sec))

  useOnEvent<TTestsGetUICfgEvt>(TestsGetUICfgEvt, cb => {
    setSection(ETestRunsSection.reporter)
    cb?.(testRunCfg)
  })
  
  const Component = SectionTabMap[section]

  return (
    <TestRunsContainer className='gb-test-run-container' >
      <TestRunsHeader className='gb-test-run-header' >
        <TestRunsHeaderText>
          Test Suite
        </TestRunsHeaderText>
      </TestRunsHeader>
    
      <TestRunsTabs
        section={section}
        onChangeSection={onChangeSection}
      />

      {
        section !== ETestRunsSection.config
          ? (<Component />)
          : (
              <TestCfgForm
                testRunCfg={testRunCfg}
                onBlurTestCfg={onBlurTestCfg}
                onChangeTestCfg={onChangeTestCfg}
              />
            )
      }
      <TestActionsFooter actions={actions} />

    </TestRunsContainer>
  )
}

