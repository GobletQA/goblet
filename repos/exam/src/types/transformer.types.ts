import type { TExecCtx } from "@GEX/types"
import type { IConstructable } from './helpers.types'


export type TTransformResp = any

export interface IBaseTransform {
  transform(
    content:string,
    ctx:TExecCtx
  ): Promise<TTransformResp>|TTransformResp
}

export type ITransform<I extends IBaseTransform=IBaseTransform> = I & IBaseTransform

export type TTransformCls<I extends IBaseTransform=IBaseTransform> = IConstructable<ITransform<I>>