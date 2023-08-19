 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import {
  Logger,
  FileTag,
  SuiteTag,
  RootSuiteTag,
  ExamEvtNames,
  TestsResultStatus,
} from "@gobletqa/exam"


const spaceMap = {
  file: `  `,
  hook: `  `,
  spec: `  `,
  suite: `  `,
  root: `    `,
  error: `    `,
}

const logFile = (location:string, rootDir?:string) => {
  const fromRoot = location?.replace(rootDir, ``).replace(/^\//, `./`)
  fromRoot && Logger.stdout(`\n${spaceMap.file}${FileTag} ${Logger.colors.white(fromRoot)}\n`)
}

/**
 * Helper to log the parent meta data - (i.e. describes)
 */
const logParent = (
  evt:TExamEvt<TExEventData>,
  isStart:boolean
) => {
  const context = evt.data
  const space = spaceFromId(evt)
  
  const isRoot = evt.name === ExamEvtNames.rootSuiteDone
    || evt.name === ExamEvtNames.rootSuiteStart
    || space.length === 4
    
  const [first, description] = context.description.split(`>`)
  const type = first.trim()

  if(isStart)
    isRoot
      ? Logger.stdout([
          `\n`,
          `${space}${RootSuiteTag(type)}`,
          ` > `,
          `${Logger.colors.gray(description.trim())}\n`
        ].join(``))
      : Logger.stdout([
          `${space}${SuiteTag(type)}`,
          ` > `,
          `${Logger.colors.gray(description.trim())}\n`
        ].join(``))

}

const spaceFromId = (evt:TExamEvt<TExEventData>) => {
  const { id, testPath } = evt.data
  if(id.startsWith(`suite`)){
    let spacer = spaceMap.suite
    const [name, ...rest] = id.split(`-`)
    rest.map(num => spacer+=`  `)
    return spacer
  }

  let spacer = spaceMap.spec
  testPath.split(`/`).map(num => spacer+=`  `)
  return spacer

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
    : spaceFromId(evt)

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
    (message += `\n${failed?.message}${Logger.colors.gray(`\n -\n`)}`)

  Logger.stdout(message)

}

const getFailedMessage = (evt:TExamEvt<TExEventData>,) => {
  const context = evt.data

  if(context.status !== TestsResultStatus.failed) return {}
  
  if(!context?.failedExpectations?.length) return {}

  const failed = context?.failedExpectations?.[0]
  if(!failed || !failed?.description) return {}

  // TODO: add better handling of error description
  // Include the error.matcherResult data colorized
  // failed?.error?.matcherResult.actual vs failed?.error?.matcherResult.expected

  const duplicates = []
  const startsWith = [`===========================`]
  const extSpace = spaceFromId(evt)

  return {
    message: `${failed.description}`.split(`\n`)
      .map(line => {
        const trimmed = line.trim()

        if(!trimmed) return false
        if(duplicates.includes(line)) return false
        if(startsWith.find(filter => trimmed.startsWith(filter))) return false

        duplicates.push(line)
        return `${extSpace}${spaceMap.error}${line}`
      })
      .concat([
        context?.testPath && `\n${extSpace}${spaceMap.error}Test Path: ${context.testPath}`
      ])
      .filter(Boolean)
      .join(`\n`)
  }

}


export class FeatureReporter implements IExamReporter {
  config:TExamConfig
  testPath?:string

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.config = examCfg
  }

  // Event `PLAY-STARTED`,
  onRunStart = (evt:TExamEvt<TExEventData>) => {
    this.testPath = evt?.data?.testPath
  }

  // Event `PLAY-SUITE-START-ROOT`
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    if(this.testPath){
      const rootDir = this.config?.rootDir
      this.testPath && logFile(this.testPath, rootDir)
      this.testPath = undefined
    }

    logResult(evt)
  }

  // Event `PLAY-SUITE-START`
  onTestStart = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestCaseStart = (evt:TExamEvt<TExEventData>) => logResult(evt)


  // Event `PLAY-SPEC-DONE`
  onTestCaseResult = (evt:TExamEvt<TExEventData>) => logResult(evt)


  // Event `PLAY-SUITE-DONE`
  onTestResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
  }

  // Event `PLAY-SUITE-DONE-ROOT` - Top level suite-0 only
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
    Logger.gray(`\n -\n`)
    Logger.empty()
  }


  // Event `PLAY-RESULTS`
  onRunComplete = () => {
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

export default FeatureReporter

