import {TExEventData} from "@GEX/types"
import { Logger } from "@GEX/utils/logger"
import {emptyObj, isStr} from "@keg-hub/jsutils"

// TODO: investigate the right way to handle this
Error.stackTraceLimit = Infinity
const ErrorTag = Logger.colors.red(`[Exam Failed]`)


const resolveErrMsg = (error?:string|Error, maybe?:Error):[string, Error] => {
  return isStr(error)
    ? [error, maybe]
    : [(error || maybe)?.message, error || maybe]
}


const replaceStackMsg = (err:Error, msg:string) => {
  const split = err.stack.split(`\n`)
  split[0] = msg

  return split.join(`\n`)
}


class BaseError extends Error {
  constructor(msg:string, err?:Error, replaceStack:boolean=true){

    const { stackTraceLimit } = Error
    if(err && replaceStack){
      // Create a new error without a stacktrace
      Error.stackTraceLimit = 0
    }

    // Set the error cause if it's different form the message
    const opts = err && msg !== err?.message
      ? { cause: err?.message }
      : undefined

    super(msg, opts)
    // Reset the original stacktrace limit
    Error.stackTraceLimit = stackTraceLimit
    
    if(replaceStack){
      if(err?.stack) this.stack = replaceStackMsg(err, msg)
      err && Error.captureStackTrace(err, this.constructor)
    }
  }
}

export class ExamError extends Error {

  name=`ExamError`
  method?:string

  constructor(mess:string, method?:string, error?:Error){
    const [message, err] = resolveErrMsg(mess, error)
    const msg = method
      ? `${Logger.colors.yellow(method)} - ${message}`
      : `${Logger.colors.yellow(`Exam`)} - ${message}`

    super(`${ErrorTag} ${msg}`)

    // TODO: figure out what this is doing
    // Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    method && (this.method = method)
    if(err?.stack) this.stack = err.stack
  }
}


export class RunnerErr extends Error {
  name=`RunnerErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)
    const msg = `${message||err?.message||`Test-Run Failed - unknown error`}`
    super(`${ErrorTag} ${msg}`)

    this.name = this.constructor.name
    if(err?.stack) this.stack = err.stack
  }
}

export class TestErr extends BaseError {
  name=`TestErr`
  result:TExEventData
  
  constructor(
    result:TExEventData,
    error?:string|Error,
    replaceStack?:boolean
  ) {
    const [message, err] = resolveErrMsg(error)
    const resMessage = result?.failedExpectations?.[0]?.description
    const fallback = message || `Test-Run Failed - unknown error`

    super(`${ErrorTag} ${resMessage || fallback}`, err, replaceStack)

    this.result = result
  }
}

export class LoaderErr extends BaseError {
  name = `LoaderErr`
  
  constructor(
    error?:string|Error,
    maybe?:Error,
    replaceStack?:boolean
  ) {
    const [message, err] = resolveErrMsg(error, maybe)
    const msg = `${ErrorTag} ${message || err?.message || `could not load file`}`

    super(msg, err, replaceStack)
  }
}