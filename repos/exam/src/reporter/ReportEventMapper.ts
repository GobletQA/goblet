import type { TExamEvt, TExBuiltReporters } from "@GEX/types"

import { Logger } from '@GEX/utils/logger'
import { EvtTag, ExamTag } from '@GEX/constants/tags'
import { TestsToSocketEvtMap } from '@gobletqa/environment/constants'

const EvtReporterMap = {

  // Event `PLAY-SUITE-DONE`
  // onSuiteResult
  [TestsToSocketEvtMap.suiteDone]: `onSuiteResult`,

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  // onTestFileResult
  [TestsToSocketEvtMap.suiteDoneRoot]: `onTestFileResult`,

  // Event `PLAY-SPEC-DONE`
  // onTestResult
  [TestsToSocketEvtMap.specDone]: `onTestResult`,

  //  Event `PLAY-SPEC-START`
  // onTestStart
  [TestsToSocketEvtMap.specStart]: `onTestStart`,

  // Event `PLAY-SUITE-START`
  // onSuiteStart
  [TestsToSocketEvtMap.suiteStart]: `onSuiteStart`,

  // Event `PLAY-SUITE-START-ROOT` - Top level suite-0 only
  // onTestFileStart
  [TestsToSocketEvtMap.suiteStartRoot]: `onTestFileStart`,
 
  // Event `PLAY-RESULTS`
  // onRunResult
  [TestsToSocketEvtMap.results]: `onRunResult`,

  // Event `PLAY-STARTED`,
  // onRunStart
  [TestsToSocketEvtMap.started]: `onRunStart`,

  // Event `PLAY-CANCELED`
  // onCancel
  [TestsToSocketEvtMap.canceled]: `onCancel`,

  // Event `PLAY-WARNING`
  // onWarning
  [TestsToSocketEvtMap.warning]: `onWarning`,

  // Event `PLAY-ERROR`
  // onError
  [TestsToSocketEvtMap.error]: `onError`,

  // Event `PLAY-FINISHED`
  // onEnd
  [TestsToSocketEvtMap.finished]: `onFinished`,

  /**
   * TODO: this event is never actually fired by exam or a runner
   * Need to figure out if it's needed
   */
  // Event `PLAY-STOPPED`
  // onStopped
  [TestsToSocketEvtMap.stopped]: `onStopped`,

  // TODO: figure out if these are needed
  // [TestsToSocketEvtMap.action]: `PLAY-ACTION`,
  // [TestsToSocketEvtMap.general]: `PLAY-GENERAL`,
  
}

const EvtTags = Object.entries(TestsToSocketEvtMap)
  .reduce((acc, [key, val]:[string, string]) => {
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