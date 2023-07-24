import type {
  TExCtx,
  TExRun,
  TExData,
  IExRunner,
  TExecuteCfg,
  TExRunnerCfg,
  TExecRunners,
  TExEventData,
  IExTransform,
  IExEnvironment,
  IConstructable,
  TExArrClsOptMap,
  TExTransformCfg,
  TExEnvironmentCfg,
  TExExtensionsCtx,
  TExecEnvironments,
  TExecTransforms,
  TExecuteBuiltRunners,
  TExecuteBuiltTransforms,
  TExecuteBuiltEnvironments,
  TExecPassThroughOpts,
  TLoadOpts,
} from '@GEX/types'

import { Exam } from "@GEX/Exam"
import { RunnerErr } from '@GEX/utils'
import { ExamEvents } from '@GEX/Events'
import {emptyObj, omitKeys} from '@keg-hub/jsutils'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { isConstructor } from '@GEX/utils/isConstructor'
import { BaseTransform } from '@GEX/transform/BaseTransform'
import { resolveTypeClass } from "@GEX/utils/resolveTypeClass"
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'

type TExecuteExisting<T> = Record<string, T>
type TResolveCfg = TExRunnerCfg|TExTransformCfg|TExEnvironmentCfg

type TResolveOpts<T, TM, C=TResolveCfg> = {
  cfg?:C
  types:TM
  type:string
  skip?:boolean
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
  existing:TExecuteExisting<T>
  options: TExRunnerCfg|TExTransformCfg|TExEnvironmentCfg
}

type TExtensionOpts = {
  runner?:boolean
  transform?:boolean,
  environment?:boolean
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
  #environments:TExecuteBuiltEnvironments={}

  runnersTypes:TExecRunners={}
  environmentTypes:TExecEnvironments={}
  transformTypes:TExecTransforms={}

  constructor(cfg:TExecuteCfg){
    const {
      exam,
      runners,
      passthrough,
      transforms,
      environments,
      preEnvironment,
      postEnvironment,
    } = cfg

    this.exam = exam
    this.passthrough = passthrough
    this.preEnvironment = [...preEnvironment]
    this.postEnvironment = [...postEnvironment]
    this.runnersTypes = {...this.runnersTypes, ...runners}
    this.transformTypes = {...this.transformTypes, ...transforms}
    this.environmentTypes = {...this.environmentTypes, ...environments}
    this.#Environment = new ExamEnvironment(passthrough.environment)
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
      environment,
    } = ctx

    const type = file.fileType
    const resp = omitKeys<TExCtx<T>>(ctx, [`runner`, `transform`, `environment`])

    if(opts.environment !== false){
      const env = this.#resolve<T,IExEnvironment,TExecEnvironments,TExEnvironmentCfg>(resp, {
        type,
        override: environment,
        skip: opts.environment,
        fallback: BaseEnvironment,
        existing: this.#environments,
        types: this.environmentTypes,
        options: this.passthrough.environment
      })

      this.#environments[type] = env
      resp.environment = env
    }

    if(opts.transform !== false){
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
    }

    if(opts.runner !== false){
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
      this.preRunner?.length
        && await this.#loadFiles(this.preRunner)

      resp = await this.#runner.run(transformed, ctx)

      this.postRunner?.length
        && await this.#loadFiles(this.postRunner)
      
    }
    catch(err){ error = err }
    finally {
      this.#Environment.resetGlobals()
      this.#Environment.cleanup()
      await this.#runner.cleanup()
      await this.cleanup(ctx)
    }

    if(error) throw new RunnerErr(error)

    return resp
  }

  exec = async <T extends TExData=TExData>(options:TExRun<T>) => {
    // Run all pre-environment scripts first
    this.preEnvironment?.length
      && await this.#loadFiles(this.preEnvironment)

    this.#Environment.setupGlobals()

    const extCtx:TExExtensionsCtx<T> = {...options, exam: this.exam}

    const ctx = this.extensions(extCtx)

    // Run post-environment scripts after environment is setup
    this.postEnvironment?.length
     && await this.#loadFiles(this.postEnvironment)

    const transformed = await ctx.transform.transform(ctx.file.content, ctx)

    return await this.#run(transformed, ctx)
  }

  cancel = async () => {
    await this.#runner.cancel()
    this.cleanup()
  }
  
  cleanup = (ctx?:TExCtx) => {
    this.#runner = undefined
    this.passthrough = undefined
    this.runnersTypes = undefined
    this.preEnvironment = undefined
    this.postEnvironment = undefined
    this.transformTypes = undefined
    this.environmentTypes = undefined

    if(!ctx) return

    ctx.exam = undefined
    ctx.transform = undefined
    ctx.environment = undefined
  }

}