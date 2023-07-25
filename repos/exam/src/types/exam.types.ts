import {TExAst, TExFileModel } from "./file.types"
import type { Exam } from "@GEX/Exam"

import type { TLoaderCfg } from "./loader.types"
import type { TExEventData } from './results.types'
import type { TExEnvironmentCfg } from "./environment.types"
import type {
  TExRun,
  TExData,
  TExecuteCfg,
  TExecPassThroughOpts
} from "./execute.types"
import {
  TExamRunners,
  TExamReporters,
  TExamEnvironments,
  TExamTransforms,
}  from './typeMaps.types'


export type TExamEvt<T=TExEventData|TExEventData[]> = {
  data?:T
  name:string
  message?:string
  isRunning?:boolean
}

type TInternalDynEvent =(evt:Partial<TExamEvt>) => TExamEvt
type TInternalMissingEvent =(evt:Partial<TExamEvt>& { type?:string, fileType?:string }) => TExamEvt

export type TExamEvts = {
  dynamic:TInternalDynEvent
  results:TInternalDynEvent
  specDone:TInternalDynEvent
  specStart:TInternalDynEvent
  suiteDone:TInternalDynEvent
  suiteStart:TInternalDynEvent
  missingType:TInternalMissingEvent
  [key:string]:TExamEvt
}

export type TExamCB = (exam:Exam) => void
export type TExamCleanupCB = TExamCB
export type TExamCancelCB = TExamCB
export type TExamEventCB = (event:TExamEvt) => void

export enum EExTestMode {
  serial=`serial`,
  parallel=`parallel`
}

export type TExamEvents = {
  events?:TExamEvts
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}

export type TExamCfg = TLoaderCfg
  & TExecPassThroughOpts[`runner`]
  & TExecPassThroughOpts[`transform`]
  & Omit<TExecPassThroughOpts[`environment`], `options`>
  & {

    /**
     * Do not throw an error when no tests are found
     */
    passWithNoTests?:boolean

    /**
     * Stop executing tests once the number of failed tests matches this amount
     * If set to 0, it is disabled
     */
    bail?:number


    // These get convert form strings to classes in the Exam Loader
    runners: TExamRunners
    transforms: TExamTransforms
    environments: TExamEnvironments

    // Gets converted to environment options in the buildExamConfig
    environment?:TExEnvironmentCfg[`options`]

    // TODO: implement reporters
    reporters?:TExamReporters

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
  & Omit<TExecuteCfg, `exam`|`runners`|`transforms`|`environments`|`passthrough`>


export type TExamRun<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = Omit<TExRun<D, Ast>, `file`> & { file?:TExFileModel<Ast>|string }

export type TExamRunOpts<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExamRun
  & TExamEvents
  & Pick<TExamConfig, `testMatch`|`testIgnore`|`extensions`|`testDir`|`rootDir`>