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

  constructor(message:string, method?:string, error?:Error){
    const msg = method ? `[ExamError:${method}] ${message}` : `[ExamError] ${message}`
    super(msg)

    method && (this.method = method)
    Error.captureStackTrace(this, this.constructor)

    error && console.error(error)
  }
}


export class RunnerErr extends Error {
  type=`RunnerErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)
    const msg = `[Exam Runner Error] ${message||err?.message||`Test-Run Failed - unknown error`}`

    super(msg)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class LoaderErr extends Error {
  type=`LoaderErr`
  
  constructor(error?:string|Error, maybe?:Error) {
    const [message, err] = resolveErrMsg(error, maybe)

    const msg = `[Exam Load Error] ${message || err?.message || `could not load file`}`

    super(msg)
    Object.assign(this, err || emptyObj, { message: msg, name: this.constructor.name })

    Error.captureStackTrace(this, this.constructor)
  }
}