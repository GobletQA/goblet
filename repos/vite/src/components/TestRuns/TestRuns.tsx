import type { FocusEvent } from 'react'
import type { TTestRunsState, TTestRunUICfg, TTestRunGetUICfgEvt } from '@types'

import { useState } from 'react'
import { ETestRunsSection } from '@types'
import { PastTestRuns } from './PastTestRuns'
import { TestCfgUpdaters } from './TestCfgUpdaters'

import { TestRunsTabs } from './TestRunsTabs'
import { TestRunGetUICfgEvt } from '@constants'
import { TestRunsHeader } from './TestRunsHeader'
import { TestRunsReporter } from './TestRunsReporter'
import { TestCfgForm } from '@components/Forms/TestCfgForm'
import { useRepo, useSettings, useTestRuns } from '@store'
import { buildTestRunCfg } from '@utils/browser/buildTestRunCfg'
import { TestRunsContainer } from './TestRuns.styled'

import {
  useInline,
  useOnEvent,
} from '@gobletqa/components'

const useTestRunOpts = (testRuns:TTestRunsState) => {
  const repo = useRepo()
  const settings = useSettings()
  const cfg = buildTestRunCfg({ repo, settings })

  const [testRunCfg, setTestRunCfg] = useState<TTestRunUICfg>(cfg)

  return {
    testRunCfg,
    setTestRunCfg,
  }
}

const SectionTabMap = {
  [ETestRunsSection.runOptions]: () => null,
  [ETestRunsSection.testRuns]: PastTestRuns,
  [ETestRunsSection.reporter]: TestRunsReporter
}

export const TestRuns = () => {
  const testRuns = useTestRuns()
  
  const {
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
    testRuns.allTestsRunning ? ETestRunsSection.reporter : ETestRunsSection.runOptions
  )

  const onChangeSection = useInline((sec:ETestRunsSection) => sec !== section && setSection(sec))

  useOnEvent<TTestRunGetUICfgEvt>(TestRunGetUICfgEvt, cb => {
    setSection(ETestRunsSection.reporter)
    cb?.(testRunCfg)
  })
  
  const Component = SectionTabMap[section]

  return (
    <TestRunsContainer className='gb-test-run-container' >
      <TestRunsHeader />
      <TestRunsTabs
        section={section}
        onChangeSection={onChangeSection}
      />

      {
        section !== ETestRunsSection.runOptions
          ? (<Component onChangeSection={onChangeSection} />)
          : (
              <TestCfgForm
                testRunCfg={testRunCfg}
                onBlurTestCfg={onBlurTestCfg}
                onChangeTestCfg={onChangeTestCfg}
              />
            )
      }
    </TestRunsContainer>
  )
}

