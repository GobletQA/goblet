import type{ ExamEnvironment } from '@GEX/environment'
import type { ReportEventMapper } from '@GEX/reporter/ReportEventMapper'
import type {
  IExamRunner,
  TExamConfig,
  TExEventData,
  TExFileModel,
  IExamEnvironment,
  TExecPassThroughOpts,
  TRunnerCls,
} from '@GEX/types'

export type TUnaryFunction<ValueType, ReturnType> = (
	value: ValueType
) => ReturnType | PromiseLike<ReturnType>;


export type TPipeline<ValueType, ReturnType> = (
	value?: ValueType
) => Promise<ReturnType>

export type TPromisePipe = (
	...functions: Array<TUnaryFunction<any, unknown>>
) => TPipeline<unknown, unknown>


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
  RunnerClasses: Record<string, TRunnerCls<any>>
}

export type TPipelineArgs = TPipelineInit & {
  state: TStateObj
  rewind: TUnaryFunction<any, any>[]
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