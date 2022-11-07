import { isObj, isStr } from '@keg-hub/jsutils'

type TExpObj = {
  msg?: string
  status?: number,
  message?: string,
  errorCode?: string
  err?: string|Error
  error?: string|Error
}

type TExp = string | TExpObj


const buildErrorArgs = (
  data:TExp,
  _status?:number,
  _errorCode?:string,
  _error?:string|Error
) => {
  const {
    err,
    msg,
    error=err,
    errorCode,
    status=400,
    message= msg || `An error has occurred`,
  } = isObj(data)
    ? { errorCode: _errorCode, status:_status, error:_error, ...data } as TExpObj
    : { errorCode: _errorCode, status:_status, error:_error, message:data } as TExpObj

  return {
    error,
    status,
    message,
    errorCode: `${errorCode || status}`,
  }

}

export class Exception extends Error {
  message: string
  status?: number
  errorCode?: string

  constructor(data:TExp, _status?:number, _errorCode?:string, _error?:string|Error) {
    const {
      error,
      status,
      message,
      errorCode
    } =buildErrorArgs(data, _status, _errorCode, _error)

    super(message)
    this.status = status
    this.message = message
    this.errorCode = `${errorCode || status}`

    // TODO: properly log passed in error if it exists
    error && (isStr(error) ? console.error(error) : console.error(error.stack))
  }
}


