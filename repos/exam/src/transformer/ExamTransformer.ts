import type { Exam } from '@GEX/Exam'
import type {
  TExData,
  TExCtx,
  IExTransform,
  TExTransformOpts
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

/**
 * ExamTransformer - Base transformer, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class ExamTransformer implements IExTransform {

  options:TExTransformOpts={}

  constructor(exam:Exam, opts?:TExTransformOpts) {
    this.options = {...this.options, ...opts}
  }

  transform = async <
    R=unknown,
    T extends TExData=TExData
  >(content:string, ctx:TExCtx<T>):Promise<R> => {
    Errors.Override(`ExamTransformer.transform`)
    return undefined
  }
}