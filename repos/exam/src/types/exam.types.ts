import {TExAst, TExFileModel } from "./file.types"

import type { TExamCliOpts } from './bin.types'
import type { TLoaderCfg } from "./loader.types"
import type { TExEventData } from './results.types'
import type {
  TExRun,
  TExData,
  TExecuteCfg,
  TExecPassThroughOpts
} from "./execute.types"
import {
  TExamRunners,
  TExamReporters,
  TExamTransforms,
  TExamEnvironment,
}  from './typeMaps.types'
import type { TExRunnerCfg } from './runner.types'
import type { TExTransformCfg } from './transform.types'
import type { TExEnvironmentCfg } from './environment.types'
import {TExBuiltReporters, TExReporterCfg} from "./reporters.types"



export type TExamEvt<T=TExEventData> = {
  data?:T
  name:string
  message?:string
  location?:string
  isRunning?:boolean
}

type TInternalDynEvent =(evt:Partial<TExamEvt>) => TExamEvt
type TInternalMissingEvent =(evt:Partial<TExamEvt>& { type?:string, fileType?:string }) => TExamEvt

export type TExamEvts = {
  started:TInternalDynEvent
  dynamic:TInternalDynEvent
  results:TInternalDynEvent
  specDone:TInternalDynEvent
  specWarn:TInternalDynEvent
  specStart:TInternalDynEvent
  suiteDone:TInternalDynEvent
  suiteStart:TInternalDynEvent
  suiteDoneRoot:TInternalDynEvent
  suiteStartRoot:TInternalDynEvent
  missingType:TInternalMissingEvent
  canceled:TExamEvt
  [key:string]:TExamEvt
}

export type TExamCB = () => void
export type TExamCleanupCB = TExamCB
export type TExamCancelCB = TExamCB
export type TExamEventCB = (event:TExamEvt) => void

export enum EExTestMode {
  serial=`serial`,
  parallel=`parallel`
}

export type TExamEvents = {
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}

export type TExamCfg = TLoaderCfg
  & TExRunnerCfg
  & TExTransformCfg
  & TExEnvironmentCfg
  & {

    /**
     * Do not throw an error when no tests are found
     */
    passWithNoTests?:boolean

    /**
     * Stop executing tests once the number of failed tests matches this amount
     * If set to 0, it is disabled
     */
    bail?:number|boolean

    // Custom reporter options
    reporter?:TExReporterCfg

    // These get convert form strings to classes in the Exam Loader
    runners?: TExamRunners
    reporters?:TExamReporters
    transforms?: TExamTransforms
    environment?: TExamEnvironment

    // TODO: implement different modes
    mode?:EExTestMode

    // TODO: implement the follow config options
    colors?:boolean
    workers?:number
    silent?:boolean
    testRetry?:number
    suiteRetry?:number
    runInBand?:boolean
    concurrency?:number

  }

export type TExamConfig = TExamCfg
  & TExamEvents
  & Omit<TExecuteCfg, `exam`|`runners`|`transforms`|`environment`|`passthrough`>


export type TExamRun<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = Omit<TExRun<D, Ast>, `file`> & {
  cli?:boolean
  single?:boolean
  file?:TExFileModel<Ast>|string
}

export type TExamRunOpts<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExamRun
  & TExamEvents
  & Pick<TExamConfig, `testMatch`|`testIgnore`|`extensions`|`testDir`|`rootDir`>

export type TExamBuilTCfg = Omit<TExamConfig, `reporters`> & { reporters: TExBuiltReporters }

export type TInitExamCfg = TExamConfig & { file?:string }
export type TInitExamOpts = TExamCliOpts & { id?:string }
