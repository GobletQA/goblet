import type { TExamEvts, TExamEvt } from '@GEX/types'


export const ExamEvtNames = {
  specDone: `PLAY-SPEC-DONE`,
  specStart: `PLAY-SPEC-START`,
  suiteDone: `PLAY-SUITE-DONE`,
  suiteStart: `PLAY-SUITE-START`,
  ended: `PLAY-ENDED`,
  error: `PLAY-ERROR`,
  action: `PLAY-ACTION`,
  general: `PLAY-GENERAL`,
  results: `PLAY-RESULTS`,
  started: `PLAY-STARTED`,
  canceled: `PLAY-CANCELED`,
}

const onEvent = (mainEvt:Partial<TExamEvt>) => {
  return (evt:Partial<TExamEvt>) => {
    return {...mainEvt, ...evt} as TExamEvt
  }
}

export const ExamEvents:TExamEvts = {
  specStart: onEvent({
    name: ExamEvtNames.specStart,
    message: `Exam - Spec Started`,
  }),
  specDone: onEvent({
    name: ExamEvtNames.specDone,
    message: `Exam - Spec Done`,
  }),
  suiteStart: onEvent({
    name: ExamEvtNames.suiteStart,
    message: `Exam - Suite Started`,
  }),
  suiteDone: onEvent({
    name: ExamEvtNames.suiteDone,
    message: `Exam - Suite Done`,
  }),
  ended: {
    message: `Exam stopped`,
    name: ExamEvtNames.ended,
  },
  alreadyPlaying: {
    name: ExamEvtNames.error,
    message: `Exam already inprogress`
  },
  canceled: {
    name: ExamEvtNames.canceled,
    message: `Exam canceled`,
  },
  noPageInstance: {
    name: ExamEvtNames.error,
    message: `A Browser page instance is required, but does not exist`
  },
  started: {
    message: `Exam started`,
    name: ExamEvtNames.started,
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
  missingType: {
    message: `Missing {type} for file type`,
    name: ExamEvtNames.error,
  },
  missingContext: {
    name: ExamEvtNames.error,
    message: `Playing context does not exist`
  },
  dynamic: onEvent({
    message: `Exam event`,
    name: ExamEvtNames.general,
  })
}