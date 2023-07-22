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
  stopped: `PLAY-STOPPED`,
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
  started: {
    message: `Exam started`,
    name: ExamEvtNames.started,
  },
  stopped: onEvent({
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
  dynamic: onEvent({
    message: `Exam event`,
    name: ExamEvtNames.general,
  }),
  missingType: (evt:Partial<TExamEvt>) => onEvent({
    name: ExamEvtNames.error,
    ...evt,
    message: `Missing ${evt?.type || ``} for file type ${evt?.fileType || ``}`
  })({}),
}