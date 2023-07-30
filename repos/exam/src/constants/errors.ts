import type { TExEventData } from "@GEX/types"

import { Logger } from "@GEX/utils/logger"
import { ExamError, LoaderErr, TestErr} from "@GEX/utils/error"

export const ErrorCodes = {
  NotFound: `ENOENT`
}

export const Errors = {
  LoadErr: (err:Error) => {
    throw new LoaderErr(err)
  },
  Override: (method:string, error?:Error) => {
    throw new ExamError(`The method is required to be overwritten by the child class`, method, error)
  },
  Transform: (method:string, file:string, error?:Error) => {
    
    throw new ExamError(
      `Failed to transform file ${Logger.colors.yellow(`"${file}"`)}`,
      method,
      error
    )
  },
  Stop: (method:string, error?:Error) => {
    throw new ExamError(`Error while attempting to stop`, method, error)
  },
  NoTests: (testMatch:string|string[], error?:Error, replaceStack?:boolean) => {
    throw new LoaderErr(
      `Tests could not be found using glob match "${Logger.colors.yellow(testMatch)}"`,
      error,
      replaceStack
    )
  },
  NotFound: (file:string, error?:Error, replaceStack?:boolean) => {
    throw new LoaderErr(
      `Could not find test file(s) at location ${Logger.colors.yellow(`"${file}"`)}\n`,
      error,
      replaceStack
    )
  },
  TestFailed: (result:TExEventData, error:Error, replaceStack?:boolean) => {
    throw new TestErr(result, error, replaceStack)
  },
  BailedTests: (bail:number, method:string, error?:Error) => {
    throw new ExamError(
      `Stopping execution. Max allowed failed tests ${Logger.colors.yellow(`"${bail}"`)} has been reached`,
      method,
      error,
    )
  },
}
