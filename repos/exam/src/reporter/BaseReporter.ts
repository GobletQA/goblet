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
import { RootSuiteTag, SuiteTag, SpecTag } from "@GEX/constants/tags"
import { noOp, get, noPropArr, isFunc, isStr, capitalize } from '@keg-hub/jsutils'

const ResultStatus = {
  failed: `failed`,
  passed: `passed`
}

const spaceMap = {
  root: `  `,
  hook: `    `,
  describe: `  `,
  test: `  `,
  error: `         `,
}

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
          `${space}${RootSuiteTag(`Test-Root`)}`,
          ` > `,
          `${Logger.colors.white(context.description)}\n`
        ].join(``))
      : Logger.stdout([
          `${space}${SuiteTag(`Describe`)}`,
          ` > `,
          `${Logger.colors.white(context.description)}\n`
        ].join(``))

}

/**
 * Helper to log test execution status in real time
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

  // Event `PLAY-STARTED`,
  onRunStart = (evt:TExamEvt) => {
    // TODO: print test header here
    console.log(`------- Run started -------`)
  }

  // Event `PLAY-SUITE-START-ROOT`
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    // console.log(`PLAY-STARTED`)
    // console.log(evt)
    this.spacer+=`  `
    logResult(evt, this.spacer)
  }

  // Event `PLAY-SUITE-START`
  onTestStart = (evt:TExamEvt<TExEventData>) => {
    // console.log(`PLAY-SUITE-START`)
    // console.log(evt)
    this.spacer+=`  `
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
    this.spacer.slice(0, this.spacer.length - 2)
    logResult(evt, this.spacer)
  }

  // Event `PLAY-SUITE-DONE-ROOT` - Top level suite-0 only
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    this.spacer.slice(0, this.spacer.length - 2)
    logResult(evt, this.spacer)
  }


  // Event `PLAY-RESULTS`
  onRunComplete = (evt:any
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => {
    Logger.empty()
  }

  onWarning = (evt:any) => {
    
  }

  // Event `PLAY-ERROR`
  onError = (evt:any
    
  ) => {
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
