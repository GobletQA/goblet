import type {
  TKubeError,
  TKubeErrorBody,
} from '@gobletqa/shared/types'

export class KubeError extends Error {
  body:TKubeErrorBody
  statusCode: number | string
  
  constructor(message:string, ext?:Partial<TKubeError>){
    super(message)
    if(ext){
      this.body = ext.body
      this.statusCode = ext.statusCode
    }
  }

}