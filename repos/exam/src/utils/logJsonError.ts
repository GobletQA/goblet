import type { TExamEvt, TEXErrorResult, TExamConfig } from '@GEX/types'
import {
  EAstObject,
  EResultStatus,
} from '@ltipton/parkin'

import { ENVS } from '@gobletqa/environment'
import { ExamErrTag } from "@GEX/constants/tags"
import { buildFailedTestResult } from './buildResult'
import { CliLogger, stripColors } from '@gobletqa/logger'
import { TestsToSocketEvtMap } from '@gobletqa/environment/constants'


export type TLogJsonError = Error & {
  cause?:string
  method?:string
  result?:string
}

const buildJsonErr = (err:TLogJsonError) => {
  const cleanStack = stripColors(err?.stack?.replace?.(ExamErrTag, ``) || ``).trim()
  const cleanMsg = stripColors(err?.message?.replace?.(ExamErrTag, ``) || ``).trim()

  const jsonErr = {
    stack: cleanStack,
    message: cleanMsg,
    type: EAstObject.error,
    name: err.name || err?.constructor?.name,
  } as TLogJsonError

  err.method && (jsonErr.method = err.method)
  err.cause && (jsonErr.cause = stripColors(`${err.cause}`).trim())
  err.result && (jsonErr.result = stripColors(`${err.result}`).trim())
  
  return jsonErr
}

/**
 * This is a utility function to log json errors that match the default output of an exam event object
 * Currently exam inits the reporters to late, which means some error events don't get picked up
 * This is a work-around to log those errors matching the expected format
 * Eventually exam should be updated so that it initializes the reporters early enough
 * To allow errors to be sent to them.
 */
export const logJsonError = (err:TLogJsonError, exam:TExamConfig) => {
  if(!ENVS.EXAM_LOG_ERR_EVENT) return

  const jsonErr = buildJsonErr(err)

  const {
    type,
    action,
    status,
    ...failedResult
  } = buildFailedTestResult()
  
  const errObj:TExamEvt<TEXErrorResult> = {
    error: true,
    isRunning: false,
    location: exam.rootDir,
    name: TestsToSocketEvtMap.error,
    message: jsonErr.message,
    data: {
      ...failedResult,
      testPath: `/`,
      error: jsonErr,
      action: `error`,
      type: EAstObject.error,
      description: jsonErr.stack,
      status: EResultStatus.failed,
    }
  }

  const logSplit = ENVS.EXAM_EVENT_LOG_SPLIT_KEY || ``
  CliLogger.stdout(`${logSplit}${JSON.stringify(errObj)}${logSplit}`)
}
