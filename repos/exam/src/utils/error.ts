import {emptyObj, isStr} from "@keg-hub/jsutils"

// TODO: investigate the right way to handle this
Error.stackTraceLimit = Infinity


const resolveErrMsg = (error?:string|Error, maybe?:Error):[string, Error] => {
  return isStr(error)
    ? [error, maybe]
    : [(error || maybe)?.message, error || maybe]
}

export class ExamError extends Error {
  
  type=`ExamError`
  method?:string

  constructor(mess:string, method?:string, error?:Error){
    const [message, err] = resolveErrMsg(mess, error)
    const msg = method ? `[ExamError:${method}] ${message}` : `[ExamError] ${message}`
    super(msg)

    // TODO: figure out what this is doing
    // Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    method && (this.method = method)
    if(err?.stack) this.stack = err.stack
  }
}


export class RunnerErr extends Error {
  type=`RunnerErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)
    const msg = `[Exam Runner Error] ${message||err?.message||`Test-Run Failed - unknown error`}`
    super(msg)

    this.name = this.constructor.name
    if(err?.stack) this.stack = err.stack
  }
}

export class LoaderErr extends Error {
  type=`LoaderErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)

    const msg = `[Exam Load Error] ${message || err?.message || `could not load file`}`

    super(msg)
    Object.assign(this, err || emptyObj, { message: msg, name: this.constructor.name })

    if(err?.stack) this.stack = err.stack
  }
}