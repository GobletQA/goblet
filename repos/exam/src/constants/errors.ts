import {ExamError} from "@GEX/utils/error"


export const Errors = {
  Override: (method:string, error?:Error) => {
    throw new ExamError(`The method is required to be overwritten by the child class`, method, error)
  },
  Sibling: (method?:string, type?:string, error?:Error) => {
    throw new ExamError(`Missing type ${type}`, method, error)
  }
}
