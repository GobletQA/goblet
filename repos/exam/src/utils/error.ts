
export class ExamError extends Error {

  method?:string

  constructor(message:string, method?:string, error?:Error){
    const msg = method ? `[ExamError:${method}] ${message}` : `[ExamError] ${message}`
    super(msg)

    method && (this.method = method)
    error && console.error(error)
  }
}
