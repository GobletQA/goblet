import type { TExEventData } from "@GEX/types"
import { ExamError, LoaderErr, TestErr} from "@GEX/utils/error"


export const Errors = {
  Override: (method:string, error?:Error) => {
    throw new ExamError(`The method is required to be overwritten by the child class`, method, error)
  },
  Transform: (method:string, file:string, error?:Error) => {
    throw new ExamError(`Failed to transform file ${file}`, method, error)
  },
  Stop: (method:string, error?:Error) => {
    throw new ExamError(`Error while attempting to stop`, method, error)
  },
  NoTests: (testMatch:string|string[], error?:Error) => {
    throw new LoaderErr(`Tests could not be found using glob match "${testMatch}"`, error)
  },
  TestFailed: (result:TExEventData, error?:string|Error, err?:Error) => {
    throw new TestErr(result, error, err)
  },
  BailedTests: (bail:number, method:string, error?:Error) => {
    throw new ExamError(
      `Stopping test execution. Max allowed failed tests "${bail}" has been reached`,
      method,
      error,
    )
  },
}
