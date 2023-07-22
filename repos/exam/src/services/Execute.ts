import type {
  IRunner,
  TExecCtx,
  TExecRun,
  TRunnerCls,
  TExecuteCfg,
  TExecRunners,
  TTransformCls,
  IConstructable,
  TExecuteOptions,
  TEnvironmentCls,
  TExecTransformers,
  TExecBuiltRunners,
  TExecEnvironments,
  TExecBuiltTransforms,
  TExecBuiltEnvironments,
  ITransform,
  IEnvironment,
} from '@GEX/types'


import { Exam } from "@GEX/exam"
import { ExamEvents } from '@GEX/constants'
import {emptyObj} from '@keg-hub/jsutils'


type TExecTypeInstance = IRunner|ITransform|IEnvironment
type TExecSubCls = TRunnerCls|TTransformCls|TEnvironmentCls
type TExecTypes<T> = Record<string, T>
type TExecExisting<T> = Record<string, T>


type TResolveOpts<T> = {
  type:string
  skip?:boolean
  existing:TExecExisting<T>
  override?:IConstructable<T>
  types:TExecTypes<IConstructable<T>>
}

type TExtensionOpts = {
  runner?:boolean
  transform?:boolean,
  environment?:boolean
}

type TExtensionResp = {
  runner?:IRunner
  transform?:ITransform,
  environment?:IEnvironment
}


export class Execute {
  
  exam:Exam
  runner:IRunner
  // A.K.A. playOptions from Player class - player.options.playOptions
  options:TExecuteOptions
  #runners:TExecBuiltRunners={}
  #transforms:TExecBuiltTransforms={}
  #environments:TExecBuiltEnvironments={}

  runnersTypes:TExecRunners={}
  transformerTypes:TExecTransformers={}
  environmentTypes:TExecEnvironments={}

  constructor(cfg:TExecuteCfg){
    const {
      exam,
      options,
      runners,
      transformers,
      environments
    } = cfg

    this.exam = exam
    this.options = {...options}
    this.runnersTypes = {...this.runnersTypes, ...runners}
    this.transformerTypes = {...this.transformerTypes, ...transformers}
    this.environmentTypes = {...this.environmentTypes, ...environments}
  }

  #resolve = <
    T extends Record<string, any>,
    I extends TExecTypeInstance
  >(
    ctx:TExecCtx<T>,
    opts:TResolveOpts<I>
  ):I => {
    const {
      skip,
      type,
      types,
      existing,
      override,
    } = opts

    if(skip !== false && !existing[type]){
      const TypeClass = override || types[type]
      if(!TypeClass){
        this.exam.fireEvent(ExamEvents.missingType)
        throw new Error(ExamEvents.missingType.message.replace(`{type}`, type))
      }

      return new TypeClass(ctx)
    }

    return existing[type]
  }

  extensions = <T extends Record<string, any>=Record<string, any>>(
    ctx:TExecCtx<T>,
    opts:TExtensionOpts=emptyObj
  ) => {
    const {
      file,
      runner,
      transform,
      environment,
      type=file?.fileType,
    } = ctx
    
    const resp:TExtensionResp = {}

    if(opts.environment !== false){
      this.#environments[type] = this.#resolve<T, IEnvironment>(ctx, {
        type,
        override: environment,
        skip: opts.environment,
        existing: this.#environments,
        types: this.environmentTypes,
      })

      resp.environment = this.#environments[type]
    }

    
    if(opts.transform !== false){
      this.#transforms[type] = this.#resolve<T, ITransform>(ctx, {
        type,
        override: transform,
        skip: opts.transform,
        existing: this.#transforms,
        types: this.transformerTypes,
      })

      resp.transform = this.#transforms[type]
    }


    if(opts.runner !== false){
      this.#runners[type] = this.#resolve<T, IRunner>(ctx, {
        type,
        override: runner,
        skip: opts.runner,
        existing: this.#runners,
        types: this.runnersTypes,
      })

      resp.runner = this.#runners[type]
    }

    return resp
  }


  exec = async <T extends Record<string, any>>(options:TExecRun<T>) => {
    const ctx:TExecCtx<T> = {...this.options, ...options, exam: this.exam}

    const {
      runner,
      transform,
      environment
    } = this.extensions(ctx)

    const resp = transform.transform(ctx.content || ctx?.file?.content, ctx)

    return await runner.run(resp, ctx)

  }

}