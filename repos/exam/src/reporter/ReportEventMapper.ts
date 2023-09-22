import type { TExamEvt, TExBuiltReporters } from "@GEX/types"

import { Logger } from '@GEX/utils/logger'
import { ExamEvtNames } from "@GEX/constants"
import { EvtTag, ExamTag } from '@GEX/constants/tags'

const EvtReporterMap = {

  // Event `PLAY-SUITE-DONE`
  // onSuiteResult
  [ExamEvtNames.suiteDone]: `onSuiteResult`,

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  // onTestFileResult
  [ExamEvtNames.suiteDoneRoot]: `onTestFileResult`,

  // Event `PLAY-SPEC-DONE`
  // onTestResult
  [ExamEvtNames.specDone]: `onTestResult`,

  //  Event `PLAY-SPEC-START`
  // onTestStart
  [ExamEvtNames.specStart]: `onTestStart`,

  // Event `PLAY-SUITE-START`
  // onSuiteStart
  [ExamEvtNames.suiteStart]: `onSuiteStart`,

  // Event `PLAY-SUITE-START-ROOT` - Top level suite-0 only
  // onTestFileStart
  [ExamEvtNames.suiteStartRoot]: `onTestFileStart`,
 
  // Event `PLAY-RESULTS` - Maybe switch this for `PLAY-ENDED` || `PLAY-STOPPED`
  // onRunResult
  [ExamEvtNames.results]: `onRunResult`,

  // Event `PLAY-STARTED`,
  // onRunStart
  [ExamEvtNames.started]: `onRunStart`,

  // Event `PLAY-CANCELED`
  // cancel
  [ExamEvtNames.canceled]: `onCancel`,

  [ExamEvtNames.warning]: `onWarning`,

  // Event `PLAY-ERROR`
  // onError
  [ExamEvtNames.error]: `PLAY-ERROR`,



  // TODO: figure out if these are needed
  // [ExamEvtNames.ended]: `PLAY-ENDED`,
  // [ExamEvtNames.action]: `PLAY-ACTION`,
  // [ExamEvtNames.general]: `PLAY-GENERAL`,
  // [ExamEvtNames.stopped]: `PLAY-STOPPED`,
  
}

const EvtTags = Object.entries(ExamEvtNames)
  .reduce((acc, [key, val]) => {
    acc[val] = EvtTag(val)
    return acc
  }, {})

export class ReportEventMapper {
  
  reporters:TExBuiltReporters

  constructor(){}

  event = async (evt:TExamEvt) => {
    const method = EvtReporterMap[evt.name]
    if(!method)
      return Logger.verbose(`${ExamTag} Missing reporter method for event ${EvtTags[evt.name]}`)

    return await Promise.all(this.reporters.map(reporter => reporter?.[method]?.(evt)))
  }
  
  cleanup = async () => {
    return Promise.all(this.reporters.map(reporter => reporter?.cleanup?.()))
  }

}