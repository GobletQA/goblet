import type {
  TExamConfig,
  TExRunResult,
  TExEventData,
} from "@GEX/types"

import { EPlayerTestType } from '@GEX/types'
import { ExamEvents } from '@GEX/events/Events'
import { emptyObj } from "@keg-hub/jsutils/emptyObj"
import {
  NoTestsFoundPass,
  BuiltExamFinished,
  TestsToSocketEvtMap,
  BuiltTestResultFailed,
} from '@gobletqa/environment/constants'

type TBuildResult = Partial<TExEventData> & {
  id:string
  testPath:string
  fullName:string
  description:string
}

const emptyBuildResult = emptyObj as TBuildResult

export const buildNoTestsResult = (result:TBuildResult=emptyBuildResult) => {
  return {
    ...NoTestsFoundPass,
    describes: [],
    timestamp: new Date().getTime(),
    ...result,
  } as TExEventData
}


export const buildFailedTestResult = (result?:TBuildResult) => {
  return {
    ...BuiltTestResultFailed,
    describes: [],
    timestamp: new Date().getTime(),
    ...result,
  } as TExEventData
}

export const buildExamFinishedEvt = (config:TExamConfig, results:TExRunResult[]) => {
  return ExamEvents.finished({
    location: config.rootDir,
    data:{
      ...BuiltExamFinished,
      stats: {},
      testPath: `/`,
      action: `finished`,
      describes: results,
      location: config.rootDir,
      type: EPlayerTestType.finished,
      id: TestsToSocketEvtMap.finished,
      fullName: EPlayerTestType.exam,
      timestamp: new Date().getTime(),
    }
  })
}

export const buildExamStopped = (config:TExamConfig) => {
  return ExamEvents.stopped({
    location: config.rootDir,
    data:{
      testPath: `/`,
      action: `stopped`,
      location: config.rootDir,
      type:EPlayerTestType.stopped,
      fullName:EPlayerTestType.exam,
      id:TestsToSocketEvtMap.stopped,
      timestamp: new Date().getTime(),
    }
  })
}