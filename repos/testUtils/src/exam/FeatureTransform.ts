import type {
  TTransform,
  TESBuildCfg,
  IExTransform,
  TExTransformCfg,
} from '@gobletqa/exam'

import { Parkin } from '@ltipton/parkin'
import { getGobletConfig } from '@gobletqa/goblet'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getParkinInstance } from '../parkin/instance'
import { createGlobMatcher, Errors } from '@gobletqa/exam'

/**
 * ExamTransform - Base transform, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class FeatureTransform<T=Record<any, any>[]> implements IExTransform<T> {

  PK:Parkin
  esbuild?:TESBuildCfg=emptyObj
  options:TExTransformCfg=emptyObj

  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {
    const { transformIgnore, esbuild, ...rest } = cfg

    this.transformIgnore = createGlobMatcher(transformIgnore)
    this.options = {...this.options, ...rest}

  }

  transform = (content:string, ctx:TTransform):Promise<T>|T => {
    const { file } = ctx
    if(this.transformIgnore(file.location)) return content as T

    try {
      const config = getGobletConfig()
      this.PK = getParkinInstance(config as any)

      const parsed = this.PK.parse.feature(file.content)

      return parsed as T
      
    }
    catch(err){
      Errors.Transform(file.location, `BaseTransform.transform`, err)

      return [{}] as T
    }
  }
  
}


export default FeatureTransform