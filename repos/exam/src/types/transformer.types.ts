import type { TExCtx, TExData } from "@GEX/types"
import type { IConstructable } from './helpers.types'


export type TExTransformOpts = {
  [key:string]: any
}

export type TTransformResp<R=unknown> = R

interface IExamTransform {
  transform<R=unknown, T extends TExData=TExData>(
    content:string,
    ctx:TExCtx<T>
  ): Promise<TTransformResp<R>>|TTransformResp<R>
}

export type IExTransform<I extends IExamTransform=IExamTransform> = I & IExamTransform

export type TTransformCls<I extends IExamTransform=IExamTransform> = IConstructable<IExTransform<I>>