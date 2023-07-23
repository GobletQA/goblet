import type {
  TExCtx,
  TExRun,
  TExData,
  IExRunner,
  TExecuteCfg,
  IExTransform,
  IExEnvironment,
  TExResolveOpts,
  IConstructable,
  TExecuteOptions,
  TExecuteRunners,
  TExecuteBuiltRunners,
  TExecuteEnvironments,
  TExecuteTransformers,
  TExecuteBuiltTransforms,
  TExecuteBuiltEnvironments,
} from '@GEX/types'


import { Exam } from "@GEX/Exam"
import { ExamEvents } from '@GEX/constants'
import {emptyObj, omitKeys} from '@keg-hub/jsutils'

type TExecuteTypes<T> = Record<string, T>
type TExecuteExisting<T> = Record<string, T>
type TExecuteTypeInstance = IExRunner|IExTransform|IExEnvironment


type TResolveOpts<T> = {
  type:string
  skip?:boolean
  override?:IConstructable<T>
  existing:TExecuteExisting<T>
  types:TExecuteTypes<IConstructable<T>>
}

type TExtensionOpts = {
  runner?:boolean
  transform?:boolean,
  environment?:boolean
}

type TExtensionResp<T extends TExData=TExData> = TExCtx<T> & {
  runner:IExRunner
}


export class Execute {
  
  exam:Exam
  runner:IExRunner
  // A.K.A. playOptions from Player class - player.options.playOptions
  options:TExecuteOptions
  #runners:TExecuteBuiltRunners={}
  #transforms:TExecuteBuiltTransforms={}
  #environments:TExecuteBuiltEnvironments={}

  runnersTypes:TExecuteRunners={}
  environmentTypes:TExecuteEnvironments={}
  transformerTypes:TExecuteTransformers={}

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
    T extends TExData,
    I extends TExecuteTypeInstance
  >(
    ctx:TExCtx<T>,
    opts:TResolveOpts<I>
    
  ):I => {
    const { file } = ctx
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
        const built = ExamEvents.missingType({
          type,
          fileType: file?.fileType
        })

        this.exam.event(built)
        throw new Error(built.message)
      }

      return new TypeClass(ctx)
    }

    return existing[type]
  }

  extensions = <T extends TExData=TExData>(
    ctx:TExResolveOpts<T>,
    opts:TExtensionOpts=emptyObj
  ) => {
    const {
      file,
      runner,
      transform,
      environment,
      type=file?.fileType,
    } = ctx
    
    const resp = omitKeys<TExtensionResp<T>>(ctx, [`runner`, `transform`, `environment`])

    if(opts.environment !== false){
      this.#environments[type] = this.#resolve<T, IExEnvironment>(resp, {
        type,
        override: environment,
        skip: opts.environment,
        existing: this.#environments,
        types: this.environmentTypes,
      })

      resp.environment = this.#environments[type]
    }

    
    if(opts.transform !== false){
      this.#transforms[type] = this.#resolve<T, IExTransform>(resp, {
        type,
        override: transform,
        skip: opts.transform,
        existing: this.#transforms,
        types: this.transformerTypes,
      })

      resp.transform = this.#transforms[type]
    }

    if(opts.runner !== false){
      this.#runners[type] = this.#resolve<T, IExRunner>(resp, {
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


  exec = async <
    T extends TExData=TExData,
    R=unknown
  >(options:TExRun<T>) => {
    const resolveOpts:TExResolveOpts<T> = {...this.options, ...options, exam: this.exam}

    const {
      runner,
      ...ctx
    } = this.extensions(resolveOpts)

    const resp = ctx.transform.transform<R, T>(ctx.content || ctx?.file?.content, ctx)

    return await runner.run<T>(resp, ctx)

  }

}