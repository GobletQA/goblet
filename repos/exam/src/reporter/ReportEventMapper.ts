import type { TExamEvt, TExBuiltReporters } from "@GEX/types"

import { Logger } from '@GEX/utils/logger'
import { ExamEvtNames } from "@GEX/constants/events"
import { EvtTag, ExamTag } from '@GEX/constants/tags'

const EvtReporterMap = {

  // Event `PLAY-SUITE-DONE`
  // onTestResult
  [ExamEvtNames.suiteDone]: `onTestResult`,

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  // onTestFileResult
  [ExamEvtNames.rootSuiteDone]: `onTestFileResult`,

  // Event `PLAY-SPEC-DONE`
  // onTestCaseResult
  [ExamEvtNames.specDone]: `onTestCaseResult`,

  //  Event `PLAY-SPEC-START`
  // onTestCaseStart
  [ExamEvtNames.specStart]: `onTestCaseStart`,

  // Event `PLAY-SUITE-START`
  // onTestStart
  [ExamEvtNames.suiteStart]: `onTestStart`,

  // Event `PLAY-SUITE-START-ROOT` - Top level suite-0 only
  // onTestFileStart
  [ExamEvtNames.rootSuiteStart]: `onTestFileStart`,
 
  // Event `PLAY-RESULTS` - Maybe switch this for `PLAY-ENDED` || `PLAY-STOPPED`
  // onRunComplete
  [ExamEvtNames.results]: `onRunComplete`,

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

  event = (evt:TExamEvt) => {

    const method = EvtReporterMap[evt.name]

    if(!method)
      return Logger.verbose(`${ExamTag} Missing reporter method for event ${EvtTags[evt.name]}`)


    this.reporters.map(reporter => reporter?.[method]?.(evt))

    // console.log(`------- reporters -------`)
    // console.log(this.reporters)
    
    // TODO: figure out the event type,
    // Then use that to call the correct method on the recorders array
    
    // Also need to add `default` and `silent` lookups to the buildReports helper method
    // Should load in the default and silent report classes, which I need to create
  }

}