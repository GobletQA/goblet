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
  ExamEvtNames,
  filterErrMessage,
  TestsResultStatus,
} from "@gobletqa/exam"

import { getRelativeLoc } from '@GTU/Utils/getRelativeLoc'

export type TLocEvt = (TExEventData & { location:string })

const logFile = (location:string, rootDir?:string) => {
  const fromRoot = getRelativeLoc(location, rootDir)
  fromRoot && Logger.stdout(`\n${spaceMap.file}${FileTag} ${Logger.colors.white(fromRoot)}\n`)
}

/**
 * Helper to log the parent meta data - (i.e. describes)
 */
const logParent = (
  evt:TExamEvt<TLocEvt>,
  isStart:boolean
) => {
  const context = evt.data
  const space = spaceFromId(context)
  
  const isRoot = evt.name === ExamEvtNames.rootSuiteDone
    || evt.name === ExamEvtNames.rootSuiteStart
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
  evt:TExamEvt<TLocEvt>,
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
    (message += `\n${failed?.message}\n`)

  Logger.stdout(message)

}

const getFailedMessage = (evt:TExamEvt<TLocEvt>,) => {
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

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
  }

  onTestFileStart = (evt:TExamEvt<TLocEvt>) => {
    logFile(evt?.data?.location, this?.rootDir)
    logResult(evt)
  }
  onTestFileResult = (evt:TExamEvt<TLocEvt>) => {
    logResult(evt)
    Logger.gray(`\n -\n`)
    Logger.empty()
  }

  onTestStart = (evt:TExamEvt<TLocEvt>) => logResult(evt)
  onTestResult = (evt:TExamEvt<TLocEvt>) => logResult(evt)
  onTestCaseStart = (evt:TExamEvt<TLocEvt>) => logResult(evt)
  onTestCaseResult = (evt:TExamEvt<TLocEvt>) => logResult(evt)

}

export default FeatureCliReporter

