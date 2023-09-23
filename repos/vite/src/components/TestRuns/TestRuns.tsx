import type { FocusEvent } from 'react'
import type { TModalAction } from '@gobletqa/components'
import type { TTestRunsState, TExamUIRun, TTestsGetExamUICfgEvt } from '@types'

import { useState } from 'react'
import { ETestRunsSection } from '@types'
import { PastTestRuns } from './PastTestRuns'
import { TestCfgUpdaters } from './TestCfgUpdaters'

import { TestRunsTabs } from './TestRunsTabs'
import { TestsGetExamUICfgEvt } from '@constants'
import { useRepo, useSettings, useTestRuns } from '@store'
import { ExamForm } from '@components/Forms/ExamForm'
import { TestRunsReporter } from './TestRunsReporter'
import { buildExamCfg } from '@utils/browser/buildExamCfg'
import {
  TestRunsHeader,
  TestActionsFooter,
  TestRunsContainer,
  TestRunsHeaderText,
} from './TestRuns.styled'

import {
  TestRunsAction,
  ExamAbortAction,
  ExamCancelAction,
} from './TestRunsActions'


import {
  useInline,
  useOnEvent,
} from '@gobletqa/components'

const useExamOpts = (testRuns:TTestRunsState) => {
  const repo = useRepo()
  const settings = useSettings()
  const cfg = buildExamCfg({ repo, settings })

  const [examCfg, setExamCfg] = useState<TExamUIRun>(cfg)

  return {
    examCfg,
    setExamCfg,
    actions: [
      testRuns.allTestsRunning ? ExamAbortAction : ExamCancelAction,
      TestRunsAction
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
    examCfg,
    setExamCfg
  } = useExamOpts(testRuns)

  const onBlurExam = useInline((evt:FocusEvent, type:keyof typeof TestCfgUpdaters) => {
    const resp = TestCfgUpdaters[type]?.onBlur?.(evt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const onChangeExam = useInline((args:any[], type:keyof typeof TestCfgUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = TestCfgUpdaters[type]?.onChange?.(evt, value, reason, opt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const [section, setSection] = useState<ETestRunsSection>(
    testRuns.allTestsRunning ? ETestRunsSection.reporter : ETestRunsSection.config
  )

  const onChangeSection = useInline((sec:ETestRunsSection) => sec !== section && setSection(sec))

  useOnEvent<TTestsGetExamUICfgEvt>(TestsGetExamUICfgEvt, cb => {
    setSection(ETestRunsSection.reporter)
    cb?.(examCfg)
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
              <ExamForm
                examCfg={examCfg}
                onBlurExam={onBlurExam}
                onChangeExam={onChangeExam}
              />
            )
      }
      <TestActionsFooter actions={actions} />

    </TestRunsContainer>
  )
}

