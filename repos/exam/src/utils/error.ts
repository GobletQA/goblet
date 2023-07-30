import {TExEventData} from "@GEX/types"
import { Logger } from "@GEX/utils/logger"
import { isArr, isStr } from "@keg-hub/jsutils"
import { ExamErrTag, WkrPoolErrTag } from "@GEX/constants/tags"

Error.stackTraceLimit = Infinity

const addErrTag = (msg:string) => {
  return msg.trim().startsWith(ExamErrTag) ? msg : `${ExamErrTag} ${msg}`
}

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

const buildMsg = (errors:Error[]) => {
  return errors.map((error:Error) => {
    if(!isStr(error.stack)) return String(error) 
      return `${error.name}: ${error.message}`
  }).join('\n')
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
  result?:TExEventData

  constructor(mess:string|Error, method?:string, error?:Error|TestErr){
    const [message, err] = resolveErrMsg(mess, error)
    const msg = method
      ? `${Logger.colors.yellow(method)} - ${message}`
      : `${Logger.colors.yellow(`Exam`)} - ${message}`

    super(addErrTag(msg))

    method && (this.method = method)
    if(err?.stack) this.stack = err.stack

    ;(error as TestErr)?.result && (this.result = (error as TestErr).result)
  }
}

export class RunnerErr extends Error {
  name=`RunnerErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)
    const msg = `${message||err?.message||`Test-Run Failed - unknown error`}`
    super(addErrTag(msg))

    this.name = this.constructor.name
    if(err?.stack) this.stack = err.stack
  }
}


export class BailError extends BaseError {

  name=`BailError`
  method?:string
  result?:TExEventData

  constructor(mess:string|Error, error?:Error|TestErr){
    const [message, err] = resolveErrMsg(mess, error)
    super(addErrTag(message), err)

    if((error as TestErr)?.result){
      this.result = (error as TestErr).result

      let msg = `\n${this.message}\n`
      this.cause && (msg += `${this.cause}\n\n`)
      process.stdout.write(msg)

    }
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

    super(addErrTag(`${resMessage || fallback}`), err, replaceStack)

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
    const msg = `${message || err?.message || `could not load file`}`

    super(addErrTag(msg), err, replaceStack)
  }
}


export class WkrPoolErr extends BaseError {
  name=WkrPoolErrTag

  constructor(message:string) {
    super(message)
  }
}

export class AggregateError extends Error {
  #errors:Error[]

  constructor(errs:Error[]) {
    if (!isArr(errs)) throw new TypeError(`Expected input to be an Array, got ${typeof errs}`)

    const errors = errs
    super(buildMsg(errors))
    this.#errors = errors
  }

  get errors() {
    return this.#errors.slice()
  }
}