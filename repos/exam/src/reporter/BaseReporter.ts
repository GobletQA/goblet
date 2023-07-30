 import type { Exam } from "@GEX/Exam"
import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@GEX/types"

import { Logger } from "@GEX/utils/logger"

import { ExamEvtNames } from "@GEX/constants/events"
import { RootSuiteTag, SuiteTag, FileTag } from "@GEX/constants/tags"
import { noOp, get, noPropArr, isFunc, isStr, capitalize } from '@keg-hub/jsutils'

const ResultStatus = {
  failed: `failed`,
  passed: `passed`
}

const spaceMap = {
  file: `  `,
  root: `    `,
  hook: `      `,
  describe: `    `,
  error: `         `,
  add: `  `
}

const logFile = (location:string, rootDir?:string) => {
  const fromRoot = location?.replace(rootDir, ``).replace(/^\//, `<root>/`)
  fromRoot && Logger.stdout(`${spaceMap.file}${FileTag} > ${Logger.colors.gray(fromRoot)}`)
}

/**
 * Helper to log the parent meta data - (i.e. describes)
 */
const logParent = (
  evt:TExamEvt<TExEventData>,
  spacer:string,
  isStart:boolean
) => {
  const context = evt.data
  
  const isRoot = evt.name === ExamEvtNames.rootSuiteDone
    || evt.name === ExamEvtNames.rootSuiteStart

  const space = isRoot ? spaceMap.root : spacer

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
  spacer:string,
  hasStepErr?:boolean
) => {
  const context = evt.data

  const isParent = context.type !== `test`
  const isStart = context.action === `start`

  if(isParent){
    logParent(evt, spacer, isStart)
    return
  }

  if(!context.action || isStart) return

  const space = context.type === `error`
    ? spaceMap.error
    : spacer

  const prefix = hasStepErr
    ? `${space || ``}${Logger.colors.yellow(`○`)}`
    : context.status === ResultStatus.passed
      ? `${space || ``}${Logger.colors.green(`✓`)}`
      : `${space || ``}${Logger.colors.red(`✕`)}`

  let message = hasStepErr
    ? `${prefix} ${Logger.colors.yellow(context.description)}\n`
    : context.status === ResultStatus.passed
      ? `${prefix} ${Logger.colors.gray(context.description)}\n`
      : `${prefix} ${Logger.colors.red(context.description)}\n`


  // context?.failedMessage && 
  //   (message += `\n${context?.failedMessage}\n\n`)

  Logger.stdout(message)

}


export class BaseReporter implements IExamReporter {
  exam:Exam
  config:TExamConfig
  spacer:string=``

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext:TEXInterReporterContext
  ) {
    this.config = examCfg
    this.exam = cfg.exam
  }

  #addSpace = () => {
    this.spacer+=spaceMap.add
  }
  
  #subSpace = () => {
    this.spacer.slice(0, this.spacer.length - spaceMap.add.length)
  }
  
  // Event `PLAY-STARTED`,
  onRunStart = (evt:TExamEvt) => {}

  // Event `PLAY-SUITE-START-ROOT`
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {

    const file = evt?.data?.metaData?.file
    const rootDir = this.exam?.loader?.rootDir
    if(file?.location){
      this.#addSpace()
      logFile(file?.location, rootDir)
    }

    this.#addSpace()
    logResult(evt, this.spacer)
  }

  // Event `PLAY-SUITE-START`
  onTestStart = (evt:TExamEvt<TExEventData>) => {
    this.#addSpace()
    logResult(evt, this.spacer)
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestCaseStart = (evt:TExamEvt<TExEventData>) => logResult(evt, this.spacer + `  `)


  // Event `PLAY-SPEC-DONE`
  onTestCaseResult = (evt:TExamEvt<TExEventData>) => logResult(evt, this.spacer + `  `)


  // Event `PLAY-SUITE-DONE`
  onTestResult = (evt:TExamEvt<TExEventData>) => {
    this.#subSpace()
    logResult(evt, this.spacer)
  }

  // Event `PLAY-SUITE-DONE-ROOT` - Top level suite-0 only
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    this.#subSpace()
    logResult(evt, this.spacer)
  }


  // Event `PLAY-RESULTS`
  onRunComplete = () => {
    this.#subSpace()
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
