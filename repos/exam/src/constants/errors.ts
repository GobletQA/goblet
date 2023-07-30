import type { TExEventData } from "@GEX/types"

import { Logger } from "@GEX/utils/logger"
import { BailError, ExamError, LoaderErr, TestErr, WkrPoolErr} from "@GEX/utils/error"

export const BailErrorName = new BailError(``).name

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
  BailedTests: (bail:number, error?:Error|TestErr) => {
    throw new BailError(
      `Stopping execution. Max allowed failed tests ${Logger.colors.yellow(`"${bail}"`)} has been reached`,
      error,
    )
  },

  /**
   * **IMPORTANT** These methods return an instance of an Error, **They Do Not Throw**
   */
  TestFailed: (result:TExEventData, error:Error, replaceStack?:boolean) => {
    return new TestErr(result, error, replaceStack)
  },
  WorkerTerminate: (workerId:string|number, code?:string|number) => {
    return new WkrPoolErr([
      `Worker ${workerId}`,
      `was ${Logger.colors.red(`terminated`)},`,
      `but returned a non-zero exit code of "${Logger.colors.yellow(code)}".\n`,
      Logger.colors.yellow(`   - This is a strong indicator of issues in the worker code.\n`),
      Logger.colors.yellow(`   - This is typically a signal that the worker to not shutdown properly\n`),
    ].join(` `))
  }
}
