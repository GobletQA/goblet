import type { TExFileModel } from './file.types'
import type { TStateObj } from './pipeline.types'
import type { TExEventData } from './results.types'
import type { IConstructable } from './helpers.types'
import type {IExamEnvironment} from './environment.types'


export type TExRunnerCfg = {
  bail?:number
  debug?: boolean
  verbose?:boolean
  testRetry?:number
  suiteRetry?:number
  reuseRunner?:boolean
  testTimeout?: number
  suiteTimeout?:number
  exitOnFailed?:boolean
  skipAfterFailed?:boolean
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

  debug?:boolean
  verbose?:boolean
  reuseRunner:boolean

  bail:number
  testRetry:number
  suiteRetry:number

  testTimeout?:number
  suiteTimeout?:number
  exitOnFailed?:boolean
  skipAfterFailed?:boolean

  canceled?:boolean
  isRunning?:boolean

  run(model:TExFileModel, state:TStateObj): Promise<TExEventData[]>

  cancel:() => void|Promise<void>
  cleanup:() => void|Promise<void>

  onRunDone(result:TExEventData, ...args:any[]):void
  onRunStart(result:TExEventData, ...args:any[]):void
  onSpecDone(result:TExEventData, ...args:any[]):void
  onSpecStart(result:TExEventData, ...args:any[]):void
  onSuiteStart(result:TExEventData, ...args:any[]):void
  onSuiteDone(result:TExEventData, ...args:any[]):void
}


export type IExRunner<
  E extends IExamEnvironment,
  R extends IExamRunner<E>
> = R & IExamRunner<E>
export type TRunnerCls<
  E extends IExamEnvironment,
  R extends IExamRunner<E>=IExamRunner<E>
> = IConstructable<IExRunner<E, R>>
