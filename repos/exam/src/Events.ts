import type { Exam } from '@GEX/Exam'
import type { TExamEvts, TExamEvt } from '@GEX/types'

import { ExamEvtNames } from '@GEX/constants'
import {emptyObj} from '@keg-hub/jsutils'

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

// TODO: normalize error event data for the 3 different types
export const formatErrorEvt = (exam:Exam) => {

  // message: err.message,
  // name: ExamEvtNames.error,
  // data: {
  //   id: this.id,
  //   testPath: errorData,
  //   fullName: err.name,
  //   description: err.message,
  //   type: EPlayerTestType.error,
  //   action: EPlayerTestAction.error,
  //   timestamp: new Date().getTime(),
  //   failedExpectations: [{
  //     fullName: errorData,
  //     description: err.stack,
  //   }]
  // }

    // id: fromRoot,
    // testPath: fromRoot,
    // fullName: file.name,
    // description: err.message,
    // type: EPlayerTestType.error,
    // action: EPlayerTestAction.error,
    // timestamp: new Date().getTime(),
    // failedExpectations: [{
    //   description: err.stack,
    //   fullName: `${err.name}${exists(err.code) ? `- ${err.code}` : ``}`,
    // }]

        // id: fromRoot,
        // testPath: fromRoot,
        // fullName: file.name,
        // description: err.message,
        // type: EPlayerTestType.error,
        // action: EPlayerTestAction.error,
        // timestamp: new Date().getTime(),
        // failedExpectations: [{
        //   description: err.stack,
        //   fullName: `${err.name}${exists(err.code) ? `- ${err.code}` : ``}`,
        // }]

}