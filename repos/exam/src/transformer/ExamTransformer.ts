import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  TExData,
  IExTransform,
  TExTransformCfg
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

/**
 * ExamTransformer - Base transformer, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class ExamTransformer<R=unknown, T extends TExData=TExData> implements IExTransform<R, T> {

  options:TExTransformCfg={}

  constructor(cfg?:TExTransformCfg) {
    this.options = {...this.options, ...cfg}
  }

  import = async <M>(ctx:TExCtx<T>):Promise<M> => {
    Errors.Override(`ExamTransformer.import`)
    return undefined
  }

  transform = async (content:string, ctx:TExCtx<T>):Promise<R> => {
    Errors.Override(`ExamTransformer.transform`)
    return undefined
  }
}
