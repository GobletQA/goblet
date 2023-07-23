import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  TExFileModelDef,
  IExTransform,
  TExTransformOpts,
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

/**
 * ExamTransformer - Base transformer, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class BaseTransformer implements IExTransform<string> {

  options:TExTransformOpts={}

  constructor(exam:Exam, opts?:TExTransformOpts) {
    this.options = {...this.options, ...opts}
  }

  import = async (ctx:TExCtx) => {
    return {
      ast: {},
      ext: ``,
      name: ``,
      content: ``,
      location: ``,
      fileType: ``,
    } as TExFileModelDef
  }

  transform = async (content:string, ctx:TExCtx):Promise<string> => {
    return undefined
  }
}
