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
  spaceMap,
  spaceFromId,
  RootSuiteTag,
  TestsToSocketEvtMap,
  filterErrMessage,
  TestsResultStatus,
} from "@gobletqa/exam"

import { getRelativeLoc } from '@GTU/Utils/fileSys'


const logFile = (location:string, rootDir?:string) => {
  const fromRoot = getRelativeLoc(location, rootDir)
  fromRoot && Logger.stdout(`\n${spaceMap.file}${FileTag} ${Logger.colors.white(fromRoot)}\n`)
}

const DimText = (text:string) => (`${Logger.colors.colorMap.dim}${text}${Logger.colors.colorMap.reset}`)

/**
 * Helper to log the parent meta data - (i.e. describes)
 */
const logParent = (
  evt:TExamEvt<TExEventData>,
  isStart:boolean
) => {
  const context = evt.data
  const space = spaceFromId(context)
  
  const isRoot = evt.name === TestsToSocketEvtMap.suiteDoneRoot
    || evt.name === TestsToSocketEvtMap.suiteStartRoot
    || space.length === 4

  const [first, description=``] = context.description.split(`>`)
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
  const isSkipped = Boolean(hasStepErr || context.status === TestsResultStatus.skipped)

  if(isParent){
    logParent(evt, isStart)
    return
  }

  if(!context.action || isStart) return

  const space = context.type === `error`
    ? spaceMap.error
    : spaceFromId(context)

  const prefix = isSkipped
    ? `${space || ``}${Logger.colors.yellow(`○`)}`
    : context.status === TestsResultStatus.passed
      ? `${space || ``}${Logger.colors.green(`✓`)}`
      : `${space || ``}${Logger.colors.red(`✕`)}`

  let message = isSkipped
    ? `${prefix} ${Logger.colors.gray(context.description)}\n`
    : context.status === TestsResultStatus.passed
      ? `${prefix} ${Logger.colors.gray(context.description)}\n`
      : `${prefix} ${Logger.colors.red(context.description)}\n`


  const failed = getFailedMessage(evt)

  failed?.message &&
    (message += `\n${failed?.message}\n`)

  const output = isSkipped ? DimText(message) : message
  Logger.stdout(output)

}

const getFailedMessage = (evt:TExamEvt<TExEventData>) => {
  const context = evt.data

  if(context.status !== TestsResultStatus.failed) return {}
  
  if(!context?.failedExpectations?.length) return {}

  const failed = context?.failedExpectations?.[0]
  if(!failed || !failed?.description) return {}

  return {
    message: filterErrMessage(context)
  }

}


export class FeatureCliReporter implements IExamReporter {
  rootDir:string
  hasStepErr?:boolean

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
  }

  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    logFile(evt?.data?.location, this?.rootDir)
    logResult(evt)
  }
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
    Logger.gray(`\n -\n`)
    Logger.empty()
  }

  onSuiteStart = (evt:TExamEvt<TExEventData>) => logResult(evt)
  onTestStart = (evt:TExamEvt<TExEventData>) => logResult(evt)
  onTestResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt, this.hasStepErr)
    
    if(evt?.data?.status !== TestsResultStatus.passed){
      Logger.stdout(`\n`)
      this.hasStepErr = true
    }
  }
  onSuiteResult = (evt:TExamEvt<TExEventData>) => {
    logResult(evt)
    // Step errors are scoped to the parent, so we always reset the step error when it finishes
    this.hasStepErr = false
  }

}

export default FeatureCliReporter

