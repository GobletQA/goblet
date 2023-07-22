import type { TExCtx, TExData } from "@GEX/types"
import type { IConstructable } from './helpers.types'
import type { TTransformResp } from './transformer.types'
import type { TPlayerEventData } from '@gobletqa/shared/types'

export interface IExamRunner {
  run<T extends TExData=TExData, R=unknown>(
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


export type IExRunner<I extends IExamRunner=IExamRunner> = I & IExamRunner

export type TRunnerCls = IConstructable<IExRunner>
