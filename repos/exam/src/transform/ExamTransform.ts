import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  TExData,
  IExTransform,
  TExTransformCfg
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'
import {createGlobMatcher} from '@GEX/utils/globMatch'

/**
 * ExamTransform - Base transform, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class ExamTransform<R=unknown> implements IExTransform<R> {

  options:TExTransformCfg={}
  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {
    const { transformIgnore, ...rest } = cfg
    this.transformIgnore = createGlobMatcher(transformIgnore)
    this.options = {...this.options, ...rest}
  }

  transform = async (content:string, ctx:TExCtx):Promise<R> => {
    Errors.Override(`ExamTransform.transform`)
    return undefined
  }
}
