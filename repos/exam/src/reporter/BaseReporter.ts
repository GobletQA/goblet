 import type { Exam } from "@GEX/Exam"
import type {
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@GEX/types"

import { Logger } from "@GEX/utils/logger"
import { noOp, get, noPropArr, isFunc, isStr, capitalize } from '@keg-hub/jsutils'

type TEvtCB = { name?:string } & ((...args:any[]) => void)
type TContext = Record<any, any>

type TJasmine = {
  getEnv: (...args:any[]) => Record<any, any>
  testPath: string
}

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

const eventMap = {
  featureStart: [],
  scenarioStart: [],
  backgroundStart: [],
  ruleStart: [],
  stepStart: [],
  featureEnd: [],
  scenarioEnd: [],
  backgroundEnd: [],
  ruleEnd: [],
  stepEnd: [],
}

/**
 * Holds the name of a test mapped to its current jasmine result context
 */
const failedSpecMap = {}


/**
 * Resolves jasmine from the global context in a safe way
 */
const resolveJasmine = ():TJasmine => {
  return typeof global.jasmine !== 'undefined'
    ? global.jasmine as unknown as TJasmine
    : { getEnv: noOp } as TJasmine
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
  onTestResult = (evt:any
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {

    // console.log(`------- BaseReporter - onTestResult -------`)
    // console.log(evt.name)

  }

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  onTestFileResult = (evt:any
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {
    // console.log(`------- BaseReporter - onTestFileResult -------`)
    // console.log(evt.name)
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestCaseStart = (evt:any
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    // console.log(`------- BaseReporter - onTestCaseStart -------`)
    // console.log(evt.name)
  }

  // Event `PLAY-SPEC-DONE`
  onTestCaseResult = (evt:any
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    // console.log(`------- BaseReporter - onTestCaseResult -------`)
    // console.log(evt.name)
  }

  // Event `PLAY-STARTED`,
  onRunStart = (evt:any
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => {
    // console.log(`------- BaseReporter - onRunStart -------`)
    // console.log(evt.name)
  }

  // Event `PLAY-SUITE-START`
  onTestStart = (evt:any
    // test: Test
  ) => {
    // console.log(`------- BaseReporter - onTestStart -------`)
    // console.log(evt.name)
  }


  // Event `PLAY-STARTED`
  onTestFileStart = (evt:any
    // test: Test
  ) => {
    // console.log(`------- BaseReporter - onTestFileStart -------`)
    // console.log(evt.name)
  }

  // Event `PLAY-RESULTS`
  onRunComplete = (evt:any
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => {
    // console.log(`------- BaseReporter - onRunComplete -------`)
    // console.log(evt.name)
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
