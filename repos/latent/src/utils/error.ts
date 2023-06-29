
export class LatentError extends Error {

  method?:string

  constructor(message:string, method?:string, error?:Error){
    const msg = method ? `[LatentError:${method}] ${message}` : `[LatentError] ${message}`
    super(msg)

    method && (this.method = method)
    error && console.error(error)
  }
}
