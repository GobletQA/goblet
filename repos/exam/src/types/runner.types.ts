import type { TExecCtx } from "@GEX/types"
import type { IConstructable } from './helpers.types'
import type { TTransformResp } from './transformer.types'
import type { TPlayerEventData } from '@gobletqa/shared/types'

export interface IBaseRunner {
  run(content:TTransformResp, ctx:TExecCtx): Promise<TPlayerEventData>
  cancel: () => void|Promise<void>
  cleanup: () => void|Promise<void>

  onSpecStarted(result:TPlayerEventData):void
  onSpecDone(result:TPlayerEventData):void

  onSuiteStarted(result:TPlayerEventData):void
  onSuiteDone(result:TPlayerEventData):void
}


export type IRunner<I extends IBaseRunner=IBaseRunner> = I & IBaseRunner

export type TRunnerCls = IConstructable<IRunner>
