import type { TExamConfig } from '@GEX/types'

export type TPipeStepFunc = (args:TPipelineArgs, manager:TStateManager, input:any) => any|Promise<any>

export type TPipelineInit = {
  id:string
  cli?:boolean
  tests: string[]
  config:TExamConfig,
  reverse: TPipeStepFunc[],
}


export type TStateObj = Record<string, any>
export type TPipelineArgs = TPipelineInit & { state: TStateObj }

export type TStateManager = {
  getState: () => TStateObj,
  delState: (key:string) => TStateObj
  addState: (add:TStateObj) => TStateObj
  setValue: (key:string, value:any) => TStateObj
}
