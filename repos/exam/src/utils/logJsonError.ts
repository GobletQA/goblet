import type { TExamEvt, TEXErrorResult } from '@GEX/types'
import {
  EAstObject,
  EResultAction,
  EResultStatus,
} from '@ltipton/parkin'

import { ENVS } from '@gobletqa/environment'
import { ExamEvtNames } from '@GEX/constants'
import { CliLogger, stripColors } from './logger'
import { buildFailedTestResult } from './buildResult'
import { NoTestsPassId, BuiltTestResultFailed, NoTestsFoundPass } from "@GEX/constants"

export type TLogJsonError = Error & {
  cause?:string
  method?:string
  result?:string
}

/**
 * This is a utility function to log json errors that match the default output of an exam event object
 * Currently exam inits the reporters to late, which means some error events don't get picked up
 * This is a work-around to log those errors matching the expected format
 * Eventually exam should be updated so that it initializes the reporters early enough
 * To allow errors to be sent to them.
 */
export const logJsonError = (err:TLogJsonError) => {
  if(!ENVS.EXAM_LOG_ERR_EVENT) return

  const jsonErr = {
    name: err.name,
    stack: err.stack,
    message: err.message,
    type: err?.constructor?.name,
  } as TLogJsonError

  err.method && (jsonErr.method = err.method)
  err.cause && (jsonErr.cause = stripColors(`${err.cause}`))
  err.result && (jsonErr.result = stripColors(`${err.result}`))

  const {
    type,
    action,
    status,
    ...failedResult
  } = buildFailedTestResult()
  
  const errObj:TExamEvt<TEXErrorResult> = {
    error: true,
    location: `/`,
    isRunning: false,
    name: ExamEvtNames.error,
    message: stripColors(err?.message),
    data: {
      ...failedResult,
      testPath: `/`,
      error: jsonErr,
      action: `error`,
      id: NoTestsPassId,
      type: EAstObject.error,
      status: EResultStatus.failed,
      description: stripColors(err?.stack),
    }
  }

  const logSplit = ENVS.EXAM_EVENT_LOG_SPLIT_KEY || ``
  CliLogger.stdout(`${logSplit}${JSON.stringify(errObj)}${logSplit}`)
}
