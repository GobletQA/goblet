import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
} from "@GEX/types"


import { Logger } from "@GEX/utils/logger"
import { filterErrMessage, spaceFromId } from "@GEX/utils/filterErrMessage"

import { TestsResultStatus, ExamEvtNames } from "@GEX/constants"
import { RootSuiteTag, SuiteTag, FileTag } from "@GEX/constants/tags"

const spaceMap = {
  file: `  `,
  hook: `  `,
  spec: `  `,
  suite: `  `,
  root: `    `,
  error: `    `,
}

const logFile = (location:string, rootDir?:string) => {
  const fromRoot = location?.replace(rootDir, ``).replace(/^\//, `<root>/`)
  fromRoot && Logger.stdout(`${spaceMap.file}${FileTag} ${Logger.colors.white(fromRoot)}`)
}

/**
 * Helper to log the parent meta data - (i.e. describes)
 */
const logParent = (
  evt:TExamEvt<TExEventData>,
  isStart:boolean
) => {
  const context = evt.data
  const space = spaceFromId(context)
  
  const isRoot = evt.name === ExamEvtNames.suiteDoneRoot
    || evt.name === ExamEvtNames.suiteStartRoot
    || space.length === 4


  if(isStart)
    isRoot
      ? Logger.stdout([
          `\n`,
          `${space}${RootSuiteTag(`Test`)}`,
          ` > `,
          `${Logger.colors.gray(context.description)}\n`
        ].join(``))
      : Logger.stdout([
          `${space}${SuiteTag(`Describe`)}`,
          ` > `,
          `${Logger.colors.gray(context.description)}\n`
        ].join(``))

}

/**
 * Helper to log test execution status in real time
 * Logs the outcome of each describe and test
 */
const logResult = (
  evt:TExamEvt<TExEventData>,
  hasStepErr?:boolean
) => {

  const context = evt.data

  const isParent = context.type !== `test`
  const isStart = context.action === `start`

  if(isParent){
    logParent(evt, isStart)
    return
  }

  if(!context.action || isStart) return

  const space = context.type === `error`
    ? spaceMap.error
    : spaceFromId(context)

  const prefix = hasStepErr
    ? `${space || ``}${Logger.colors.yellow(`○`)}`
    : context.status === TestsResultStatus.passed
      ? `${space || ``}${Logger.colors.green(`✓`)}`
      : `${space || ``}${Logger.colors.red(`✕`)}`

  let message = hasStepErr
    ? `${prefix} ${Logger.colors.yellow(context.description)}\n`
    : context.status === TestsResultStatus.passed
      ? `${prefix} ${Logger.colors.gray(context.description)}\n`
      : `${prefix} ${Logger.colors.red(context.description)}\n`


  const failed = getFailedMessage(evt)

  failed?.message && 
    (message += `\n${failed?.message}\n\n`)

  Logger.stdout(message)

}

const getFailedMessage = (evt:TExamEvt<TExEventData>,) => {
  const context = evt.data

  if(context.status !== TestsResultStatus.failed) return {}
  
  if(!context?.failedExpectations?.length) return {}

  const failed = context?.failedExpectations?.[0]
  if(!failed || !failed?.description) return {}

  return {
    message: filterErrMessage(context)
  }

}

export class BaseReporter implements IExamReporter {
  config:TExamConfig

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
  ) {
    this.config = examCfg
  }

  // Event `PLAY-STARTED`,
  onRunStart = (evt:TExamEvt) => {}

  // Event `PLAY-SUITE-START-ROOT`
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {

    const file = evt?.data?.metaData?.file
    const rootDir = this.config?.rootDir
    file?.location && logFile(file?.location, rootDir)

    logResult(evt)
  }

  // Event `PLAY-SUITE-START`
  onSuiteStart = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestStart = (evt:TExamEvt<TExEventData>) => logResult(evt)


  // Event `PLAY-SPEC-DONE`
  onTestResult = (evt:TExamEvt<TExEventData>) => logResult(evt)


  // Event `PLAY-SUITE-DONE`
  onSuiteResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
  }

  // Event `PLAY-SUITE-DONE-ROOT` - Top level suite-0 only
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
    Logger.empty()
  }


  // Event `PLAY-RESULTS`
  onRunResult = () => {
    Logger.empty()
  }

  onWarning = (evt:any) => {}

  // Event `PLAY-ERROR`
  onError = (evt:any) => {
    // console.log(`------- BaseReporter - onError -------`)
    // console.log(evt.name)
  }

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError = () => {
    // Error | void;
  }

  // Event `PLAY-CANCELED`
  onCancel = (evt:any) => {
    // console.log(`------- BaseReporter - onCancel -------`)
    // console.log(evt.name)
  }

  cleanup = () => {
    
  }

}
