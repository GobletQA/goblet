import type {
  TRunContent,
} from './FeatureRunner'
import {
  TTransform,
  TESBuildCfg,
  IExTransform,
  createGlobMatcher,
  TExTransformCfg,
} from "@gobletqa/exam"

import {emptyObj} from '@keg-hub/jsutils'

export class FeatureTransformer implements IExTransform<TRunContent> {

  esbuild?:TESBuildCfg=emptyObj
  options:TExTransformCfg=emptyObj
  transformIgnore:(match:string) => boolean

  constructor(cfg?:TExTransformCfg) {

    const { transformIgnore, esbuild, ...rest } = cfg

    if(esbuild) this.esbuild = esbuild
    this.transformIgnore = createGlobMatcher(transformIgnore)
    
    this.options = {...this.options, ...rest}
  }

  transform = (content:string, ctx:TTransform, sync?:boolean):Promise<TRunContent>|TRunContent => {

    const { file } = ctx
    if(this.transformIgnore(file.location)) return content as TRunContent


    // TODO: use parkin to convert to Feature AST
    return {} as TRunContent
  }
}