import type {
  TTransform,
  TESBuildCfg,
  IExTransform,
  TExTransformCfg,
} from '@GEX/types'


import * as esbuild from 'esbuild'
import { emptyObj } from '@keg-hub/jsutils'
import { Errors } from '@GEX/constants/errors'
import { createGlobMatcher } from '@GEX/utils/globMatch'

/**
 * ExamTransform - Base transform, used for all files by default
 * Can be overridden by defining custom transforms in a config
 */
export class BaseTransform<T=string> implements IExTransform<T> {

  esbuild?:TESBuildCfg=emptyObj
  options:TExTransformCfg=emptyObj
  
  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {

    const { transformIgnore, esbuild, ...rest } = cfg

    if(esbuild) this.esbuild = esbuild
    this.transformIgnore = createGlobMatcher(transformIgnore)
    
    this.options = {...this.options, ...rest}
  }

  #onTransform = (transformed:esbuild.TransformResult) => {
    transformed.warnings?.length
      && transformed.warnings.map(warn => console.log(warn))

    return transformed.code
  }

  #esOpts = (cfg:TESBuildCfg=emptyObj) => {
    const { hookMatcher:_, ...rest } = cfg
    const { hookMatcher:__, ...local } = this.esbuild

    return {...local, ...rest}
  }

  transformAsync = async (content:string, cfg:TESBuildCfg):Promise<string> => {
    const transformed = await esbuild.transform(content, this.#esOpts(cfg))
    return this.#onTransform(transformed)
  }
  
  transformSync = (content:string, cfg:TESBuildCfg):string => {
    const transformed = esbuild.transformSync(content, this.#esOpts(cfg))
    return this.#onTransform(transformed)
  }
  
  transform = (content:string, ctx:TTransform, sync?:boolean):Promise<T>|T => {
    const { file, esbuild } = ctx
    if(this.transformIgnore(file.location)) return content as T

    try {
      const { hookMatcher, ...opts} = (esbuild || {})
      
      return sync
        ? this.transformSync(content, opts) as T
        : this.transformAsync(content, opts) as T
    }
    catch(err){
      Errors.Transform(file.location, `BaseTransform.transform`, err)

      return content as T
    }
  }
  
}
