import type { TExamEvts, TExamEvt } from '@GEX/types'

import { ExamEvtNames } from '@GEX/constants'
import {emptyObj} from '@keg-hub/jsutils/emptyObj'

export const onExDynEvent = (mainEvt:Partial<TExamEvt>) => {
  return (evt:Partial<TExamEvt>) => {
    return {...mainEvt, ...evt} as TExamEvt
  }
}

const __ExamEvents:TExamEvts = {
  specStart: onExDynEvent({
    name: ExamEvtNames.specStart,
    message: `Exam - Spec Started`,
  }),
  specDone: onExDynEvent({
    name: ExamEvtNames.specDone,
    message: `Exam - Spec Done`,
  }),
  specWarn: onExDynEvent({
    name: ExamEvtNames.specWarn,
    message: `Exam - Warning, Spec failed`,
  }),
  suiteStart: onExDynEvent({
    name: ExamEvtNames.suiteStart,
    message: `Exam - Suite Started`,
  }),
  suiteDone: onExDynEvent({
    name: ExamEvtNames.suiteDone,
    message: `Exam - Suite Done`,
  }),
  rootSuiteStart: onExDynEvent({
    name: ExamEvtNames.rootSuiteStart,
    message: `Exam - Root Suite Started`,
  }),
  rootSuiteDone: onExDynEvent({
    name: ExamEvtNames.rootSuiteDone,
    message: `Exam - Root Spec Done`,
  }),
  results: onExDynEvent({
    name: ExamEvtNames.results,
    message: `Exam - Suite Results`,
  }),
  started: onExDynEvent({
    message: `Exam started`,
    name: ExamEvtNames.started,
  }),
  stopped: onExDynEvent({
    name: ExamEvtNames.stopped,
    message: `Exam stopped`,
  }),
  ended: {
    message: `Exam finished`,
    name: ExamEvtNames.ended,
  },
  canceled: {
    name: ExamEvtNames.canceled,
    message: `Exam canceled`,
  },
  alreadyPlaying: {
    name: ExamEvtNames.error,
    message: `Exam already inprogress`
  },
  missingTransform: {
    message: `Missing transform for file type`,
    name: ExamEvtNames.error,
  },
  missingRunner: {
    message: `Missing runner for file type`,
    name: ExamEvtNames.error,
  },
  missingEnvironment: {
    message: `Missing environment for file type`,
    name: ExamEvtNames.error,
  },
  dynamic: onExDynEvent({
    message: `Exam event`,
    name: ExamEvtNames.general,
  }),
  missingType: (evt:Partial<TExamEvt> & { type?:string, fileType?:string }) => onExDynEvent({
    name: ExamEvtNames.error,
    ...evt,
    message: `Missing ${evt?.type || ``} for file type ${evt?.fileType || ``}`
  })({}),
}

export let ExamEvents:TExamEvts={...__ExamEvents}

export const addCustomEvents = (evts:Partial<TExamEvts>=emptyObj as Partial<TExamEvts>) => {
  ExamEvents = {...__ExamEvents, ...evts}
}
