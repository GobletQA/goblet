import type { TExEventData } from './results.types'
import type { IConstructable } from './helpers.types'
import type { TExCtx, TExData } from "./execute.types"
import type { TTransformResp } from './transform.types'
import {IExamEnvironment} from './environment.types'

export type TExRunnerCfg = {
  debug?: boolean
  timeout?: number
  verbose?:boolean
  globalTimeout?:number
  omitTestResults?:string[]
}

type TBaseExecutor = {
  test: (desc:string, ...args:any[]) => any
  describe: (desc:string, ...args:any[]) => any
  it?: (desc:string, ...args:any[]) => any
  xit?: (desc:string, ...args:any[]) => any
  xtest?: (desc:string, ...args:any[]) => any
  xdescribe?: (desc:string, ...args:any[]) => any
  afterAll?: (desc:string, ...args:any[]) => any
  afterEach?: (desc:string, ...args:any[]) => any
  beforeAll?: (desc:string, ...args:any[]) => any
  beforeEach?: (desc:string, ...args:any[]) => any
}

export type TTestExecutor<T extends TBaseExecutor=TBaseExecutor> = T


export interface IExamRunner<E extends IExamEnvironment> {
  environment:E
  debug?: boolean
  timeout?: number
  verbose?:boolean
  globalTimeout?:number

  run<R=any, T=any>(content:TTransformResp, ctx:TExCtx<T>): Promise<TExEventData[]>

  cancel:() => void|Promise<void>
  cleanup:() => void|Promise<void>

  onSpecStarted(result:TExEventData):void
  onSpecDone(result:TExEventData):void

  onSuiteStarted(result:TExEventData):void
  onSuiteDone(result:TExEventData):void
}


export type IExRunner<
  E extends IExamEnvironment,
  R extends IExamRunner<E>
> = R & IExamRunner<E>
export type TRunnerCls<
  E extends IExamEnvironment,
  R extends IExamRunner<E>
> = IConstructable<IExRunner<E, R>>
