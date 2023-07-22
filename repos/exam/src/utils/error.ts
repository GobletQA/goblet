
export class ExamError extends Error {
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
  constructor(message:string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}