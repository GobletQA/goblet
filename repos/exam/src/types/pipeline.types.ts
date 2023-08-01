import type { UnaryFunction } from 'p-pipe'
import type{ ExamEnvironment } from '@GEX/environment'
import type { ReportEventMapper } from '@GEX/reporter/ReportEventMapper'
import type {
  IExamRunner,
  TExamConfig,
  TExEventData,
  TExFileModel,
  TTypeFromFileMap,
  IExamEnvironment,
  TExecPassThroughOpts,
} from '@GEX/types'

export type TPipeStepFunc = (args:TPipelineArgs, manager:TStateManager, input:any) => any|Promise<any>

export type TPipelineInit = {
  id:string
  tag?:string
  cli?:boolean
  single?:boolean
  config:TExamConfig,
  file?:TExFileModel|string
  testMatch?: string|string[]
}

export type TStateObj = {
  responses:any[]
  require:NodeRequire
  data?:Record<any, any>
  TestResults: TExEventData[]
  EventReporter:ReportEventMapper
  ExamEnvironment:ExamEnvironment
  passthrough:TExecPassThroughOpts
  BaseEnvironment:IExamEnvironment<any>
  RunnerClasses: TTypeFromFileMap<IExamRunner<any>>
}

export type TPipelineArgs = TPipelineInit & {
  state: TStateObj
  rewind: UnaryFunction<any, any>[]
}

export type TStateManager<S=TStateObj> = {
  cleanup:() => void
  getState: <T=S>() => T,
  delState: <T=S>(key:string) => T
  addState: <T=S>(add:T) => T
  setValue: <T=S>(key:string, value:any) => T
}

export type TPipelineResponse = TExEventData[]

export type TPipeTestPrep = { model: TExFileModel, Runner: IExamRunner<any>}