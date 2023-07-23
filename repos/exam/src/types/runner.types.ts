import type { TExCtx, TExData } from "@GEX/types"
import type { IConstructable } from './helpers.types'
import type { TTransformResp } from './transformer.types'
import type { TPlayerEventData } from '@gobletqa/shared/types'

export type TExRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
  [key:string]: any
}

export interface IExamRunner<T extends TExData=TExData, R=unknown> {
  run(
    content:TTransformResp<R>,
    ctx:TExCtx<T>
  ): Promise<TPlayerEventData>
  cancel: () => void|Promise<void>
  cleanup: () => void|Promise<void>

  onSpecStarted(result:TPlayerEventData):void
  onSpecDone(result:TPlayerEventData):void

  onSuiteStarted(result:TPlayerEventData):void
  onSuiteDone(result:TPlayerEventData):void
}


export type IExRunner<
  T extends TExData=TExData,
  R=unknown,
  I extends IExamRunner<T, R>=IExamRunner<T, R>
> = I & IExamRunner

export type TRunnerCls<T extends TExData=TExData, R=unknown> = IConstructable<IExRunner<T, R>>
