import type {
  TExCtx,
  IExTransform,
  TExTransformCfg,
} from '@GEX/types'

import * as esbuild from 'esbuild'
import { Errors } from '@GEX/constants/errors'
import {createGlobMatcher} from '@GEX/utils/globMatch'

/**
 * ExamTransform - Base transform, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class BaseTransform implements IExTransform<string> {

  options:TExTransformCfg={}
  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {

    const { transformIgnore, ...rest } = cfg
    this.transformIgnore = createGlobMatcher(transformIgnore)
    
    this.options = {...this.options, ...rest}
  }

  transform = async (content:string, ctx:TExCtx):Promise<string> => {
    const { exam, file } = ctx
    if(this.transformIgnore(file.location)) return content

    try {
      const { hookMatcher, ...opts} = (exam.loader.esbuild || {})
      const transformed = await esbuild.transform(content, opts)
      transformed.warnings?.length
        && transformed.warnings.map(warn => console.log(warn))

      return transformed.code
    }
    catch(err){
      Errors.Transform(file.location, `BaseTransform.transform`, err)

      return content
    }
  }
}
