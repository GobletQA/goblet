import type { FocusEvent } from 'react'
import type {
  TTestRunsState,
  TTestRunUICfg,
  TOnBlurRunTestOpts,
  TTestRunGetUICfgEvt,
  TOnChangeRunTestOpts,
} from '@types'

import { useState } from 'react'
import { ETestRunsSection } from '@types'
import { PastTestRuns } from './PastTestRuns'
import { TestRunGetUICfgEvt } from '@constants'
import { RunTestOptions } from './RunTestOptions'
import { TestRunsContainer } from './TestRuns.styled'
import { useRepo, useSettings, useTestRuns } from '@store'
import { TestRunsTabs } from './TestRunHelpers/TestRunsTabs'
import { TestRunsHeader } from './TestRunHelpers/TestRunsHeader'
import { buildTestRunCfg } from '@utils/browser/buildTestRunCfg'
import { TestCfgUpdaters } from './RunTestOptions/TestCfgUpdaters'
import { TestRunsReporter } from './TestReporter/TestRunsReporter'
import { useTestRunListen } from '@hooks/testRuns/useTestRunListen'

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

  const onBlurRunTestOpts = useInline<TOnBlurRunTestOpts>((evt, type) => {
    const resp = TestCfgUpdaters[type as keyof typeof TestCfgUpdaters]?.onBlur?.(evt, testRunCfg)
    resp && setTestRunCfg({...testRunCfg, ...resp })
  })

  const onChangeRunTestOpts = useInline<TOnChangeRunTestOpts>((args:any[], type) => {
    const [evt, value, reason, opt] = args
    const resp = TestCfgUpdaters[type as keyof typeof TestCfgUpdaters]?.onChange?.(
      evt,
      value,
      reason,
      opt,
      testRunCfg
    )

    resp && setTestRunCfg({...testRunCfg, ...resp })
  })

  const [section, setSection] = useState<ETestRunsSection>(
    testRuns.allTestsRunning ? ETestRunsSection.reporter : ETestRunsSection.runOptions
  )

  const onChangeSection = useInline((sec:ETestRunsSection) => sec !== section && setSection(sec))

  const {
    runs,
    active,
    setRunId,
    allTestsRunning,
  } = useTestRunListen()

  useOnEvent<TTestRunGetUICfgEvt>(TestRunGetUICfgEvt, cb => {
    setSection(ETestRunsSection.reporter)
    setRunId(undefined)
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
          ? (
              <Component
                runs={runs}
                active={active}
                setRunId={setRunId}
                allTestsRunning={allTestsRunning}
                onChangeSection={onChangeSection}
              />
            )
          : (
              <RunTestOptions
                testRunCfg={testRunCfg}
                onBlurRunTestOpts={onBlurRunTestOpts}
                onChangeRunTestOpts={onChangeRunTestOpts}
              />
            )
      }
    </TestRunsContainer>
  )
}
