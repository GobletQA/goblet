import type {
  TExCtx,
  TExRun,
  TExData,
  IExRunner,
  TLoadOpts,
  TExecuteCfg,
  TExRunnerCfg,
  TExecRunners,
  TExEventData,
  IExTransform,
  IExEnvironment,
  IConstructable,
  TExArrClsOptMap,
  TExTransformCfg,
  TExecTransforms,
  TExecEnvironment,
  TExExtensionsCtx,
  TExecPassThroughOpts,
  TExecuteBuiltRunners,
  TExecuteBuiltTransforms,
  TExecuteBuiltEnvironment,
} from '@GEX/types'

import { Exam } from "@GEX/Exam"
import { RunnerErr } from '@GEX/utils'
import { ExamEvents } from '@GEX/Events'
import { EnvironmentCfg } from '@GEX/constants'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { isConstructor } from '@GEX/utils/isConstructor'
import { BaseTransform } from '@GEX/transform/BaseTransform'
import { resolveTypeClass } from "@GEX/utils/resolveTypeClass"
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'
import {emptyObj, ensureArr, isObj, omitKeys} from '@keg-hub/jsutils'

type TExecuteExisting<T> = Record<string, T>
type TResolveCfg = TExRunnerCfg|TExTransformCfg


type TResolveOpts<T, TM, C=TResolveCfg> = {
  cfg?:C
  types:TM
  type:string
  skip?:boolean
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
  existing:TExecuteExisting<T>
  options: TExRunnerCfg|TExTransformCfg
}

type TExtensionOpts = {
  runner?:boolean
  transform?:boolean,
  environment?:boolean
}

type TExecStates = {
  envPre?:boolean
  envPost?:boolean
  envSetup?:boolean
  runnerPre?:boolean
  runnerPost?:boolean
  environment?:boolean
  runnerLoaded?:boolean
}

export class Execute {
  
  exam:Exam
  #runner:IExRunner
  preRunner?:string[]
  postRunner?:string[]
  preEnvironment?:string[]
  postEnvironment?:string[]
  #Environment:ExamEnvironment
  #runners:TExecuteBuiltRunners={}
  passthrough:TExecPassThroughOpts
  #transforms:TExecuteBuiltTransforms={}
  runnersTypes:TExecRunners={}
  transformTypes:TExecTransforms={}

  #environment:TExecuteBuiltEnvironment
  environmentType:TExecEnvironment
  
  #states:TExecStates={
    envPre: false,
    envPost: false,
    envSetup: false,
    environment: false,
    runnerLoaded: false,
  }

  constructor(cfg:TExecuteCfg){
    const {
      exam,
      runners,
      preRunner,
      postRunner,
      transforms,
      passthrough,
      environment,
      preEnvironment,
      postEnvironment,
    } = cfg

    this.exam = exam
    this.passthrough = passthrough
    this.preRunner = [...preRunner]
    this.postRunner = [...postRunner]
    this.preEnvironment = [...preEnvironment]
    this.postEnvironment = [...postEnvironment]
    this.runnersTypes = {...this.runnersTypes, ...runners}
    this.transformTypes = {...this.transformTypes, ...transforms}

    this.environmentType = environment?.length
      ? environment
      : [BaseEnvironment, EnvironmentCfg]

    this.#Environment = new ExamEnvironment(passthrough.environment, exam)
  }

  #resolve = <T, I, M, C>(ctx:TExCtx<T>, opts:TResolveOpts<I, M, C>):I => {
    const { file } = ctx
    const {
      skip,
      type,
      types,
      options,
      fallback,
      existing,
      override,
    } = opts

    if(skip !== false && !existing[type]){
      const [TypeClass, cfg] = resolveTypeClass<I>({
        fallback,
        override,
        type: types[type]
      })

      if(!TypeClass){
        const built = ExamEvents.missingType({
          type,
          fileType: file?.fileType as string
        })

        this.exam.event(built)
        throw new Error(built.message)
      }

      return isConstructor<I>(TypeClass)
        ? new TypeClass({...options, ...cfg}, ctx)
        : TypeClass
    }

    return existing[type]
  }

  #setupEnvironment = async <T extends TExData=TExData>(ctx:TExExtensionsCtx<T>) => {

    if(!this.#states.envPre){
      // Run all pre-environment scripts first
      this.preEnvironment?.length
        && await this.#loadFiles(this.preEnvironment)

      this.#states.envPre = true
    }

    if(!this.#states.environment){
      this.#Environment.setup()

      const inline = ensureArr(ctx.environment)
      const [EnvironType, typeCfg] = this.environmentType
      const cfg = inline[1] || typeCfg
      const Environ = inline[0] || EnvironType

      this.#environment = isConstructor<IExEnvironment>(Environ)
        ? new Environ({...this.passthrough.environment, ...cfg}, ctx)
        : isObj<IExEnvironment>(Environ)
          ? Environ
          : undefined

      this.#states.environment = true
    }

    if(!this.#states.envPost){
      // Run post-environment scripts after environment is setup
      this.postEnvironment?.length
      && await this.#loadFiles(this.postEnvironment)

      this.#states.envPost = true
    }
  
  }

  #loadFiles = async (files:string[], opts:TLoadOpts=emptyObj) => {
    return this.exam.loader.loadMany(files, opts)
  }

  extensions = <T extends TExData=TExData>(
    ctx:TExExtensionsCtx<T>,
    opts:TExtensionOpts=emptyObj
  ) => {
    const {
      file,
      runner,
      transform,
    } = ctx

    const type = file.fileType
    const resp = {
      ...omitKeys<TExCtx<T>>(ctx, [`runner`, `transform`, `environment`]),
      environment: this.#environment
    }

    const trans = this.#resolve<T,IExTransform,TExecTransforms,TExTransformCfg>(resp, {
      type,
      override: transform,
      skip: opts.transform,
      fallback: BaseTransform,
      existing: this.#transforms,
      types: this.transformTypes,
      options: this.passthrough.transform
    })
    this.#transforms[type] = trans
    resp.transform = trans

    if(!this.#states.runnerLoaded){

      const run = this.#resolve<T,IExRunner,TExecRunners,TExRunnerCfg>(resp, {
        type,
        override: runner,
        skip: opts.runner,
        fallback: BaseRunner,
        existing: this.#runners,
        types: this.runnersTypes,
        options: this.passthrough.runner
      })
      this.#runners[type] = run
      this.#runner = run

      this.#states.runnerLoaded = true
    }

    return resp
  }

  #run = async (
    transformed:unknown,
    ctx:TExCtx,
  ) => {
    let error:Error
    let resp:TExEventData[]

    try {

      await this.#environment.setup(this.#runner, ctx)

      this.preRunner?.length
        && await this.#loadFiles(this.preRunner, {cache: false, force: true})

      resp = await this.#runner.run(transformed, ctx)

      this.postRunner?.length
        && await this.#loadFiles(this.postRunner, {cache: false, force: true})

    }
    catch(err){ error = err }
    finally {

      this.#Environment.reset()
      await this.#environment?.reset?.(this.#runner)
      
      if(error){
        await this.cleanup(ctx)
        throw new RunnerErr(error)
      }

      return resp
    }

  }

  exec = async <T extends TExData=TExData>(options:TExRun<T>) => {
    const extCtx:TExExtensionsCtx<T> = {...options, exam: this.exam}

    await this.#setupEnvironment(extCtx)

    const ctx = this.extensions(extCtx)
    const transformed = await ctx.transform.transform(ctx.file.content, ctx)

    return await this.#run(transformed, ctx)
  }

  cancel = async () => {
    await this.#runner.cancel()
    this.cleanup()
  }
  
  cleanup = async (ctx?:TExCtx) => {

    if(this.#Environment){
      this.#Environment.cleanup()
      this.#Environment = undefined
    }

    if(this.#environment){
      await this.#environment?.cleanup?.(this.#runner)
      this.#environment = undefined
    }

    if(this.#runner){
      await this.#runner?.cleanup?.()
      this.#runner = undefined
    }

    this.exam = undefined
    this.preRunner = undefined
    this.postRunner = undefined
    this.preEnvironment = undefined
    this.postEnvironment = undefined

    this.passthrough = undefined
    this.runnersTypes = undefined
    this.transformTypes = undefined
    this.environmentType = undefined

    if(!ctx) return

    ctx.exam = undefined
    ctx.transform = undefined
    ctx.environment = undefined
  }

}