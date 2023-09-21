import type { FocusEvent } from 'react'
import type { TModalAction } from '@gobletqa/components'
import type { TExamUIRun, TExamGetExamUICfgEvt } from '@types'

import { useState } from 'react'
import { ExamUpdaters } from './ExamUpdaters'
import { ExamGetExamUICfgEvt } from '@constants'
import { useRepo, useSettings, useApp } from '@store'
import { ExamForm } from '@components/Forms/ExamForm'
import { buildExamCfg } from '@utils/browser/buildExamCfg'


import {
  ExamRunAction,
  ExamAbortAction,
  ExamCancelAction,
} from './ExamRunActions'

import {
  useInline,
  useOnEvent,
} from '@gobletqa/components'

const useExamOpts = () => {
  const repo = useRepo()
  const settings = useSettings()
  const cfg = buildExamCfg({ repo, settings })

  const [examCfg, setExamCfg] = useState<TExamUIRun>(cfg)
  const app = useApp()

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
  const {
    actions,
    examCfg,
    setExamCfg
  } = useExamOpts()

  const onBlurExam = useInline((evt:FocusEvent, type:keyof typeof ExamUpdaters) => {
    const resp = ExamUpdaters[type]?.onBlur?.(evt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  const onChangeExam = useInline((args:any[], type:keyof typeof ExamUpdaters) => {
    const [evt, value, reason, opt] = args
    const resp = ExamUpdaters[type]?.onChange?.(evt, value, reason, opt, examCfg)
    resp && setExamCfg({...examCfg, ...resp })
  })

  useOnEvent<TExamGetExamUICfgEvt>(
    ExamGetExamUICfgEvt,
    cb => cb?.(examCfg)
  )

  return (
    <ExamForm
      actions={actions}
      examCfg={examCfg}
      onBlurExam={onBlurExam}
      onChangeExam={onChangeExam}
    />
  )
}

