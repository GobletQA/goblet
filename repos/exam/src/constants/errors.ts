import {ExamError} from "@GEX/utils/error"


export const Errors = {
  Override: (method:string, error?:Error) => {
    throw new ExamError(`The method is required to be overwritten by the child class`, method, error)
  },
  Transform: (method:string, file:string, error?:Error) => {
    throw new ExamError(`Failed to transform file ${file}`, method, error)
  },
  Stop: (method:string, error?:Error) => {
    throw new ExamError(`Error while attempting to stop`, method, error)
  }
}
