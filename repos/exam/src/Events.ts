import type { TExamEvts, TExamEvt } from '@GEX/types'

import { ExamEvtNames } from '@GEX/constants'

export const onExDynEvent = (mainEvt:Partial<TExamEvt>) => {
  return (evt:Partial<TExamEvt>) => {
    return {...mainEvt, ...evt} as TExamEvt
  }
}

export const __ExamEvents:TExamEvts = {
  specStart: onExDynEvent({
    name: ExamEvtNames.specStart,
    message: `Exam - Spec Started`,
  }),
  specDone: onExDynEvent({
    name: ExamEvtNames.specDone,
    message: `Exam - Spec Done`,
  }),
  suiteStart: onExDynEvent({
    name: ExamEvtNames.suiteStart,
    message: `Exam - Suite Started`,
  }),
  suiteDone: onExDynEvent({
    name: ExamEvtNames.suiteDone,
    message: `Exam - Suite Done`,
  }),
  results: onExDynEvent({
    name: ExamEvtNames.results,
    message: `Exam - Suite Results`,
  }),
  started: {
    message: `Exam started`,
    name: ExamEvtNames.started,
  },
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
  missingTransformer: {
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
  missingType: (evt:Partial<TExamEvt>) => onExDynEvent({
    name: ExamEvtNames.error,
    ...evt,
    message: `Missing ${evt?.type || ``} for file type ${evt?.fileType || ``}`
  })({}),
}

export let ExamEvents:TExamEvts={...__ExamEvents}

export const addCustomEvents = (evts:TExamEvts) => {
  ExamEvents = {...__ExamEvents, ...evts}
}
