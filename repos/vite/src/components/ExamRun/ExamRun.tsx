import type { FocusEvent } from 'react'
import type { TModalAction } from '@gobletqa/components'
import type { TExamUIRun, TExamGetExamUICfgEvt, TAppState } from '@types'

import { useState } from 'react'
import { ExamUpdaters } from './ExamUpdaters'
import { cls, wordCaps } from '@keg-hub/jsutils'

import { ExamGetExamUICfgEvt } from '@constants'
import { useRepo, useSettings, useApp } from '@store'
import { ExamForm } from '@components/Forms/ExamForm'
import { ExamEventReporter } from './ExamEventReporter'
import { buildExamCfg } from '@utils/browser/buildExamCfg'
import {
  ExamSection,
  ExamSectionBtn,
  ExamRunHeader,
  ExamRunContainer,
  ExamRunHeaderText,
  ExamSectionsContainer
} from './ExamRun.styled'

import {
  ExamRunAction,
  ExamAbortAction,
  ExamCancelAction,
} from './ExamRunActions'


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
      app.examRunning ? ExamAbortAction : ExamCancelAction,
      ExamRunAction
    ] as TModalAction[],
  }
}

export const ExamRun = () => {
  const app = useApp()
  
  const {
    actions,
    examCfg,
    setExamCfg
  } = useExamOpts(app)

  const onBlurExam = useInline((evt:FocusEvent, type:keyof typeof ExamUpdaters) => {
    const resp = ExamUpdaters[type]?.onBlur?.(evt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const onChangeExam = useInline((args:any[], type:keyof typeof ExamUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = ExamUpdaters[type]?.onChange?.(evt, value, reason, opt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const [section, setSection] = useState<TExamSections>(
    app.examRunning ? EExamSection.reporter : EExamSection.config
  )

  const onChangeSection = useInline((sec:TExamSections) => sec !== section && setSection(sec))

  useOnEvent<TExamGetExamUICfgEvt>(ExamGetExamUICfgEvt, cb => {
    setSection(`reporter`)
    cb?.(examCfg)
  })

  return (
    <ExamRunContainer className='gb-exam-run-container' >
      <ExamRunHeader>
        <ExamRunHeaderText>
          Run Test Suite
        </ExamRunHeaderText>
      </ExamRunHeader>
    
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
    </ExamRunContainer>
  )
}

