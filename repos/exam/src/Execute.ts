import type {
  TExCtx,
  TExRun,
  TExData,
  IExRunner,
  TLoadOpts,
  TExecuteCfg,
  TLoadRunner,
  TExecRunners,
  TExEventData,
  IExTransform,
  IExEnvironment,
  TLoadTransform,
  TExecTransforms,
  TExecEnvironment,
  TExExtensionsCtx,
  TExecPassThroughOpts,
  TExecuteBuiltRunners,
  TExecuteBuiltTransforms,
  TExecuteBuiltEnvironment,
  TLoadFilesArr,
} from '@GEX/types'

import { Exam } from "@GEX/Exam"
import { RunnerErr } from '@GEX/utils'
import { EnvironmentCfg, Errors, LoaderCfg } from '@GEX/constants'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { globTypeMatch } from "@GEX/utils/globMatch"
import { isConstructor } from '@GEX/utils/isConstructor'
import {typeClassFromLoc} from '@GEX/utils/typeClassFromLoc'
import { BaseTransform } from '@GEX/transform/BaseTransform'
import { resolveTypeClass } from "@GEX/utils/resolveTypeClass"
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'
import {emptyObj, ensureArr, isArr, isObj, isStr, omitKeys} from '@keg-hub/jsutils'

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
  #runner:IExRunner<any, any>
  #Environment:ExamEnvironment
  preRunner?:TLoadFilesArr
  postRunner?:TLoadFilesArr
  preEnvironment?:TLoadFilesArr
  postEnvironment?:TLoadFilesArr
  #runners:TExecuteBuiltRunners={}
  passthrough:TExecPassThroughOpts
  #transforms:TExecuteBuiltTransforms={}
  runnerTypes:TExecRunners={}
  transformTypes:TExecTransforms={}

  #environment:TExecuteBuiltEnvironment
  environmentType:TExecEnvironment
  baseTransformExt = LoaderCfg.extensions
  
  
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
    this.runnerTypes = {...this.runnerTypes, ...runners}
    this.transformTypes = {...this.transformTypes, ...transforms}
    this.preRunner = [...ensureArr(preRunner)].filter(Boolean)
    this.postRunner = [...ensureArr(postRunner)].filter(Boolean)
    this.preEnvironment = [...ensureArr(preEnvironment)].filter(Boolean)
    this.postEnvironment = [...ensureArr(postEnvironment)].filter(Boolean)

    this.environmentType = environment?.length
      ? environment
      : [BaseEnvironment, EnvironmentCfg]

    this.#Environment = new ExamEnvironment(passthrough.environment, exam)

  }

  setupEnvironment = async <T extends TExData=TExData>(ctx:TExExtensionsCtx<T>) => {
    try {
      if(!this.#states.envPre){
        // Run all pre-environment scripts first
        this.preEnvironment?.length
          && await this.#loadFiles(this.preEnvironment)

        this.#states.envPre = true
      }
    }
    catch(err){
      if(err.message.includes(`Cannot find module`)){
        const loc = err.message.split(`Error: Cannot find module `).pop().replaceAll(`'`)
        Errors.LoadErr(err, loc)
      }
      Errors.ExecErr(err.message, err)
    }


    try {
      if(!this.#states.environment){
        this.#Environment.setup()

        const inline = ensureArr(ctx.environment)
        const [EnvironType, typeCfg] = this.environmentType
        const cfg = inline[1] || typeCfg
        const Environ = inline[0] || EnvironType

        this.#environment = isConstructor<IExEnvironment<any, any>>(Environ)
          ? new Environ({...this.passthrough.environment, ...cfg}, ctx)
          : isObj<IExEnvironment<any, any>>(Environ)
            ? Environ
            : undefined

        this.#states.environment = true
      }
    }
    catch(err){
      if(err.message.includes(`Cannot find module`)){
        const loc = err.message.split(`Error: Cannot find module `).pop().replaceAll(`'`)
        Errors.LoadErr(err, loc)
      }
      Errors.ExecErr(err.message, err)
    }

    try {
      if(!this.#states.envPost){
        // Run post-environment scripts after environment is setup
        this.postEnvironment?.length
        && await this.#loadFiles(this.postEnvironment)
        this.#states.envPost = true
      }
    }
    catch(err){
      if(err.message.includes(`Cannot find module`)){
        const loc = err.message.split(`Error: Cannot find module `).pop().replaceAll(`'`)
        Errors.LoadErr(err, loc)
      }
      
      Errors.ExecErr(err.message, err)
    }
  
  }

  #loadFiles = async (files:TLoadFilesArr, opts:TLoadOpts=emptyObj) => {
    // const tranOpts = {
    //   type:``,
    //   options: {},
    //   override: undefined,
    //   fallback: BaseTransform,
    // }

    // TODO: add loading a transform here for files
    // Loop through files and load their transforms if they exist
    return this.exam.loader.loadMany(files, opts)
  }

  #execSetup = async <T extends TExData=TExData>(options:TExRun<T>) => {
    const {
      file,
      runner,
      transform,
    } = options

    const ctx:TExExtensionsCtx<T> = {...options, exam: this.exam}

    const resp = {
      ...omitKeys<TExCtx<T>>(ctx, [`runner`, `transform`, `environment`]),
      environment: this.#environment
    }

    const trans = this.loadTransform({
      file,
      override: transform,
      fallback: BaseTransform,
    })

    if(trans) resp.transform = trans

    if(!this.#states.runnerLoaded){

      const run = this.loadRunner({
        ctx,
        file,
        override: runner,
        fallback: BaseRunner,
      })

      if(run){
        resp.runner = run
        this.#runner = run
      }

      this.#states.runnerLoaded = true
    }

    return resp
  }

  #run = async (
    transformed:unknown,
    ctx:TExCtx,
  ) => {
    let resp:TExEventData[]
    let error:Error & { result?: TExEventData }

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

      /**
       * If it has a result, then it should be a failed test
       * So throw the error again, so it can be picked up by exam and captured
       * Otherwise assume it's an error with the Runner, and run clean up before throwing
       */
      if(error?.result) throw error

      this.#Environment.reset()
      await this.#environment?.reset?.(this.#runner)

      if(error){
        await this.cleanup(ctx)
        throw new RunnerErr(error)
      }

      return resp
    }

  }

  loadTransform = <T extends IExTransform=IExTransform>(opts:TLoadTransform<T>) => {
    const {
      file,
      options,
      override,
      fallback,
    } = opts

    const type = file.fileType

    // When cache is being set the original type is used, So a glob match is not needed
    if(this.#transforms[type])
      return this.#transforms[type]

    const [TypeClass, cfg] = resolveTypeClass<IExTransform>({
      fallback,
      override: override || typeClassFromLoc<IExTransform>(file, this.transformTypes),
      type: globTypeMatch(this.transformTypes, type)
    })

    if(!TypeClass) return undefined

    const transform = isConstructor<T>(TypeClass)
      ? new TypeClass({
          ...this.passthrough.transform,
          ...cfg,
          ...options,
        })
      : TypeClass

    this.#transforms[type] = transform

    return this.#transforms[type]
  }


  loadRunner = <T extends IExRunner<any, any>>(opts:TLoadRunner<T>) => {
    const {
      ctx,
      file,
      options,
      override,
      fallback,
    } = opts
    
    const type = file.fileType

    if(this.#runners[type])
      return this.#runners[type]

    const [TypeClass, cfg] = resolveTypeClass<IExRunner<any, any>>({
      fallback,
      override: override || typeClassFromLoc<IExTransform>(file, this.runnerTypes),
      type: globTypeMatch(this.runnerTypes, type)
    })

    if(!TypeClass) return undefined

    const runner = isConstructor<T>(TypeClass)
      ? new TypeClass({
          ...this.passthrough.runner,
          ...cfg,
          ...options,
        }, ctx)
      : TypeClass

    this.#runners[type] = runner

    return this.#runners[type]
  }

  exec = async <T extends TExData=TExData>(options:TExRun<T>) => {

    const ctx = await this.#execSetup(options)
    const transformed = options?.file?.transformed
      ? options?.file?.transformed
      : await ctx.transform.transform(ctx.file.content, ctx)

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
    this.runnerTypes = undefined
    this.transformTypes = undefined
    this.environmentType = undefined

    if(!ctx) return

    ctx.exam = undefined
    ctx.transform = undefined
    ctx.environment = undefined
  }

}