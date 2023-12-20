import type { TExamEvts, TExamEvt } from '@GEX/types'

import {emptyObj} from '@keg-hub/jsutils/emptyObj'
import { TestsToSocketEvtMap } from '@gobletqa/environment/constants'

export const onExDynEvent = (mainEvt:Partial<TExamEvt>) => {
  return (evt:Partial<TExamEvt>) => {
    return {...mainEvt, ...evt} as TExamEvt
  }
}

const __ExamEvents:TExamEvts = {
  specStart: onExDynEvent({
    name: TestsToSocketEvtMap.specStart,
    message: `Exam - Spec Started`,
  }),
  specDone: onExDynEvent({
    name: TestsToSocketEvtMap.specDone,
    message: `Exam - Spec Done`,
  }),
  specWarn: onExDynEvent({
    name: TestsToSocketEvtMap.specWarn,
    message: `Exam - Warning, Spec failed`,
  }),
  suiteStart: onExDynEvent({
    name: TestsToSocketEvtMap.suiteStart,
    message: `Exam - Suite Started`,
  }),
  suiteDone: onExDynEvent({
    name: TestsToSocketEvtMap.suiteDone,
    message: `Exam - Suite Done`,
  }),
  suiteStartRoot: onExDynEvent({
    name: TestsToSocketEvtMap.suiteStartRoot,
    message: `Exam - Root Suite Started`,
  }),
  suiteDoneRoot: onExDynEvent({
    name: TestsToSocketEvtMap.suiteDoneRoot,
    message: `Exam - Root Spec Done`,
  }),
  results: onExDynEvent({
    name: TestsToSocketEvtMap.results,
    message: `Exam - Suite Results`,
  }),
  started: onExDynEvent({
    message: `Exam started`,
    name: TestsToSocketEvtMap.started,
  }),
  stopped: onExDynEvent({
    name: TestsToSocketEvtMap.stopped,
    message: `Exam stopped`,
  }),
  error: onExDynEvent({
    name: TestsToSocketEvtMap.error,
    message: `Exam error`,
  }),
  finished: onExDynEvent({
    message: `Exam finished`,
    name: TestsToSocketEvtMap.finished,
  }),
  canceled: {
    name: TestsToSocketEvtMap.canceled,
    message: `Exam canceled`,
  },
  alreadyPlaying: {
    name: TestsToSocketEvtMap.error,
    message: `Exam already inprogress`
  },
  missingTransform: {
    message: `Missing transform for file type`,
    name: TestsToSocketEvtMap.error,
  },
  missingRunner: {
    message: `Missing runner for file type`,
    name: TestsToSocketEvtMap.error,
  },
  missingEnvironment: {
    message: `Missing environment for file type`,
    name: TestsToSocketEvtMap.error,
  },
  dynamic: onExDynEvent({
    message: `Exam event`,
    name: TestsToSocketEvtMap.general,
  }),
  missingType: (evt:Partial<TExamEvt> & { type?:string, fileType?:string }) => onExDynEvent({
    name: TestsToSocketEvtMap.error,
    ...evt,
    message: `Missing ${evt?.type || ``} for file type ${evt?.fileType || ``}`
  })({}),
}

export let ExamEvents:TExamEvts={...__ExamEvents}

export const addCustomEvents = (evts:Partial<TExamEvts>=emptyObj as Partial<TExamEvts>) => {
  ExamEvents = {...__ExamEvents, ...evts}
}
