 import type {
  Exam,
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import { Logger } from "@GEX/utils/logger"
import { capitalize } from '@keg-hub/jsutils'
type TContext = Record<any, any>

const ResultStatus = {
  failed: `failed`,
  passed: `passed`
}

const spaceMap = {
  browser: ` `,
  feature: `  `,
  scenario: `    `,
  background: `    `,
  step: `      `,
  error: `         `,
}

const logParent = (context:TContext, isStart:boolean) => {

  const isFeature = context.type === `feature`
  
  if(isStart){
    if(isFeature){
      const browserType = (global?.__goblet?.browser?.type || process.env.GOBLET_BROWSER)
        browserType
          ? Logger.stdout(`\n${spaceMap.browser}Browser: ${Logger.colors.brightCyan(capitalize(browserType))}\n`)
          : Logger.empty()
    }

    return Logger.stdout(`${spaceMap[context.type] || ``} ${Logger.colors.white(context.description)}\n`)
  }

  return isFeature && Logger.stdout(`\n`)
}

/**
 * Helper to log test execution status as it happends
 */
const logResult = (context:TContext, hasStepErr?:boolean) => {

  const isParent = context.type !== `step`
  const isStart = context.action === `start`

  if(isParent) return logParent(context, isStart)

  if(!context.action || isStart) return

  const prefix = hasStepErr
    ? `${spaceMap[context.type] || ``}${Logger.colors.yellow(`○`)}`
    : context.status === ResultStatus.passed
      ? `${spaceMap[context.type] || ``}${Logger.colors.green(`✓`)}`
      : `${spaceMap[context.type] || ``}${Logger.colors.red(`✕`)}`

  let message = hasStepErr
    ? `${prefix} ${Logger.colors.yellow(context.description)}\n`
    : context.status === ResultStatus.passed
      ? `${prefix} ${Logger.colors.gray(context.description)}\n`
      : `${prefix} ${Logger.colors.red(context.description)}\n`

  context?.failedMessage && 
    (message += `\n${context?.failedMessage}\n\n`)

  Logger.stdout(message)

}

export class BaseReporter implements IExamReporter {
  exam:Exam
  config:TExamConfig

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext:TEXInterReporterContext
  ) {
    this.config = examCfg
    this.exam = cfg.exam
  }

  // Event `PLAY-SUITE-DONE`
  onTestResult = logResult

  onTestFileResult = logResult
  //  Event `PLAY-SPEC-START`
  onTestCaseStart = logResult
  // Event `PLAY-SPEC-DONE`
  onTestCaseResult = logResult
  // Event `PLAY-STARTED`,
  onRunStart = logResult
  // Event `PLAY-SUITE-START`
  onTestStart = logResult
  // Event `PLAY-STARTED`
  onTestFileStart = logResult
  // Event `PLAY-RESULTS`
  onRunComplete = logResult

  onWarning = (evt:any) => {}

  // Event `PLAY-ERROR`
  onError = (evt:any) => {}

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError = ():Error | void => {}

  // Event `PLAY-CANCELED`
  onCancel = (evt:any) => {}

  cleanup = () => {}

}
