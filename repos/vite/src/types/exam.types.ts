import type { FocusEvent } from 'react'
import type { ExamUpdaters } from '@components/ExamRun/ExamUpdaters'

export type TExamUpdaters = typeof ExamUpdaters
export type TOnChangeExam = (args: any[], type: keyof TExamUpdaters) => void
export type TOnBlurExam = (evt: FocusEvent, type: keyof TExamUpdaters) => void
