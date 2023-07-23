import type { TExCtx, TExData } from "@GEX/types"
import type { IConstructable } from './helpers.types'
import type { TExFileAst, TExFileLoaded } from './file.types'

export type TExTransformCfg = {
  [key:string]: any
}

export type TTransformResp<R=unknown> = R

export interface IExamTransform<R=unknown, T extends TExData=TExData> {
  import<M extends TExFileAst=TExFileAst>(ctx:TExCtx<T>): Promise<TExFileLoaded<M>>
  transform(
    content:string,
    ctx:TExCtx<T>
  ): Promise<TTransformResp<R>>|TTransformResp<R>
}

export type IExTransform<
  R=unknown,
  T extends TExData=TExData,
  I extends IExamTransform<R, T>=IExamTransform<R, T>
> = I & IExamTransform<R, T>

export type TTransformCls<
  R=unknown,
  T extends TExData=TExData,
  I extends IExamTransform<R, T>=IExamTransform<R, T>
> = IConstructable<IExTransform<R, T, I>>