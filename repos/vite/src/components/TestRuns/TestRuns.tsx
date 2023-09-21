import type { FocusEvent } from 'react'
import type { TModalAction } from '@gobletqa/components'
import type { TExamUIRun, TTestsGetExamUICfgEvt, TAppState } from '@types'

import { useState } from 'react'
import { cls, wordCaps } from '@keg-hub/jsutils'
import { TestCfgUpdaters } from './TestCfgUpdaters'

import { TestsGetExamUICfgEvt } from '@constants'
import { useRepo, useSettings, useApp } from '@store'
import { ExamForm } from '@components/Forms/ExamForm'
import { ExamEventReporter } from './ExamEventReporter'
import { buildExamCfg } from '@utils/browser/buildExamCfg'
import {
  ExamSection,
  ExamSectionBtn,
  TestRunsHeader,
  TestRunsContainer,
  TestRunsHeaderText,
  ExamSectionsContainer
} from './TestRuns.styled'

import {
  TestRunsAction,
  ExamAbortAction,
  ExamCancelAction,
} from './TestRunsActions'


import {
  useInline,
  useOnEvent,
  GobletIcon,
} from '@gobletqa/components'


export type TExamSections = `config`|`reporter`

export enum EExamSection {
  config=`config`,
  reporter=`reporter`,
}

const useExamOpts = (app:TAppState) => {
  const repo = useRepo()
  const settings = useSettings()
  const cfg = buildExamCfg({ repo, settings })

  const [examCfg, setExamCfg] = useState<TExamUIRun>(cfg)

  return {
    examCfg,
    setExamCfg,
    actions: [
      app.allTestsRunning ? ExamAbortAction : ExamCancelAction,
      TestRunsAction
    ] as TModalAction[],
  }
}

export const TestRuns = () => {
  const app = useApp()
  
  const {
    actions,
    examCfg,
    setExamCfg
  } = useExamOpts(app)

  const onBlurExam = useInline((evt:FocusEvent, type:keyof typeof TestCfgUpdaters) => {
    const resp = TestCfgUpdaters[type]?.onBlur?.(evt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const onChangeExam = useInline((args:any[], type:keyof typeof TestCfgUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = TestCfgUpdaters[type]?.onChange?.(evt, value, reason, opt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const [section, setSection] = useState<TExamSections>(
    app.allTestsRunning ? EExamSection.reporter : EExamSection.config
  )

  const onChangeSection = useInline((sec:TExamSections) => sec !== section && setSection(sec))

  useOnEvent<TTestsGetExamUICfgEvt>(TestsGetExamUICfgEvt, cb => {
    setSection(`reporter`)
    cb?.(examCfg)
  })

  return (
    <TestRunsContainer className='gb-exam-run-container' >
      <TestRunsHeader>
        <TestRunsHeaderText>
          Run Test Suite
        </TestRunsHeaderText>
      </TestRunsHeader>
    
      <ExamSectionsContainer className='gb-exam-sections-container' >
        <ExamSection className='gb-exam-section' >
          <ExamSectionBtn
            className={cls(
              `gb-exam-section-button`,
              section === EExamSection.config && `active`,
            )}
            text={wordCaps(EExamSection.config)}
            onClick={() => onChangeSection(EExamSection.config)}
          />
        </ExamSection>

        <ExamSection className='gb-exam-section' >
          <ExamSectionBtn
            className={cls(
              `gb-exam-section-button`,
              section === EExamSection.reporter && `active`,
            )}
            text={wordCaps(EExamSection.reporter)}
            onClick={() => onChangeSection(EExamSection.reporter)}
          />
        </ExamSection>
      </ExamSectionsContainer>
    {
      section === `reporter`
        ? (<ExamEventReporter />)
        : (
            <ExamForm
              actions={actions}
              examCfg={examCfg}
              onBlurExam={onBlurExam}
              onChangeExam={onChangeExam}
            />
          )
    }
    </TestRunsContainer>
  )
}

