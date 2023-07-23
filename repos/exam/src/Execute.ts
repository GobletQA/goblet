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
  TExArrClsOptMap,
  TExecuteBuiltRunners,
  TExecuteEnvironments,
  TExecuteTransformers,
  TExecuteBuiltTransforms,
  TExecuteBuiltEnvironments,
  TExEventData,
} from '@GEX/types'

import { Exam } from "@GEX/Exam"
import { RunnerErr } from '@GEX/utils'
import { ExamEvents } from '@GEX/Events'
import { ExecuteOpts } from '@GEX/constants'
import {emptyObj, omitKeys} from '@keg-hub/jsutils'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { isConstructor } from '@GEX/utils/isConstructor'
import { resolveTypeClass } from "@GEX/utils/resolveTypeClass"
import { BaseTransformer } from '@GEX/transformer/BaseTransformer'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'

type TExecuteExisting<T> = Record<string, T>

type TResolveOpts<T, TM> = {
  types:TM
  type:string
  skip?:boolean
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
  existing:TExecuteExisting<T>
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
    this.options = {...ExecuteOpts, ...options}
    this.runnersTypes = {...this.runnersTypes, ...runners}
    this.transformerTypes = {...this.transformerTypes, ...transformers}
    this.environmentTypes = {...this.environmentTypes, ...environments}
  }

  #resolve = <T, I, M>(ctx:TExCtx<T>, opts:TResolveOpts<I, M>):I => {
    const { file } = ctx
    const {
      skip,
      type,
      types,
      fallback,
      existing,
      override,
    } = opts

    if(skip !== false && !existing[type]){
      const [TypeClass, opts] = resolveTypeClass<I>({
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
        ? new TypeClass(ctx, opts)
        : TypeClass
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
      this.#environments[type] = this.#resolve<T,IExEnvironment,TExecuteEnvironments>(resp, {
        type,
        override: environment,
        skip: opts.environment,
        fallback: BaseEnvironment,
        existing: this.#environments,
        types: this.environmentTypes,
      })

      resp.environment = this.#environments[type]
    }

    if(opts.transform !== false){
      this.#transforms[type] = this.#resolve<T,IExTransform,TExecuteTransformers>(resp, {
        type,
        override: transform,
        skip: opts.transform,
        fallback: BaseTransformer,
        existing: this.#transforms,
        types: this.transformerTypes,
      })

      resp.transform = this.#transforms[type]
    }

    if(opts.runner !== false){
      this.#runners[type] = this.#resolve<T,IExRunner,TExecuteRunners>(resp, {
        type,
        override: runner,
        skip: opts.runner,
        fallback: BaseRunner,
        existing: this.#runners,
        types: this.runnersTypes,
      })

      resp.runner = this.#runners[type]
    }

    return resp
  }

  exec = async <
    T extends TExData=TExData,
  >(options:TExRun<T>) => {
    const resolveOpts:TExResolveOpts<T> = {
      ...this.options,
      ...options,
      exam: this.exam
    }

    const {
      runner,
      ...ctx
    } = this.extensions(resolveOpts)
    this.runner = runner

    const transformed = ctx.transform.transform(ctx.content || ctx?.file?.content, ctx)

    let error:Error
    let resp:TExEventData[]

    try {
      resp = await runner.run(transformed, ctx)
    }
    catch(err){
      error = err
    }
    finally {
      this.runner = undefined
    }

    if(error) throw new RunnerErr(error)

    return resp
  }
  
  cancel = async () => {
    await this.runner.cancel()
    await this.cleanup()
  }
  
  cleanup = async () => {
    this.runner = undefined
    this.options = undefined
    this.runnersTypes = undefined
    this.transformerTypes = undefined
    this.environmentTypes = undefined
  }

}