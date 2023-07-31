import {Exam} from "@GEX/Exam"
import type { IExEnvironment, IExRunner, TESBuildCfg, TExFileModel } from "@GEX/types"
import type { IConstructable } from './helpers.types'

export type TExTransformCfg = {
  transformIgnore?:string[]
  esbuild?:TESBuildCfg|false
}

export type TTransformResp<R=unknown> = R

export interface IExamTransform<R extends any=any> {
  transformIgnore:string[]|((location:string) => boolean)
  transform(
    content:string,
    ctx:Partial<TTransform> & Record<string, any>
  ): Promise<R>|R
}

export type IExTransform<
  R=any,
  I extends IExamTransform<R>=IExamTransform<R>
> = I & IExamTransform<R>

export type TTransformCls<
  R=unknown,
  I extends IExamTransform<R>=IExamTransform<R>
> = IConstructable<IExTransform<R, I>>


export type TTransform = {
  exam:Exam,
  file?:TExFileModel
  esbuild?:TESBuildCfg|false
  runner:IExRunner<any, any>
  environment:IExEnvironment<any, any>
}