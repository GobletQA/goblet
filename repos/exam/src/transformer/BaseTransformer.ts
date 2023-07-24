import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  IExTransform,
  TExFileModelDef,
  TExTransformCfg,
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

/**
 * ExamTransformer - Base transformer, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class BaseTransformer implements IExTransform<string> {

  options:TExTransformCfg={}

  constructor(cfg?:TExTransformCfg) {
    this.options = {...this.options, ...cfg}
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
