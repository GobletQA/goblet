import type { Exam } from '@GEX/Exam'
import type {
  IExRunner,
  TLoadOpts,
  TExTypeCls,
  TExTypeCfg,
  TExTypeMap,
  TExecuteCfg,
  TExamConfig,
  TExamRunners,
  TExRunnerCfg,
  IExTransform,
  IExEnvironment,
  TExTransformCfg,
  TExecuteOptsMap,
  TExamTransforms,
  TExEnvironmentCfg,
  TExecPassThroughOpts,
} from '@GEX/types'

import { isNum } from '@keg-hub/jsutils'
import { convertTypeStrToCls } from './convertTypeStrToCls'
import {
  RunnerCfg,
  TransformCfg,
  EnvironmentCfg
} from '@GEX/constants/defaults'

const loopLoadTypes = async <
  T=TExTypeMap,
  I=TExTypeCls,
  C=TExTypeCfg
>(
  exam:Exam,
  typeMap:T,
  options:TLoadOpts,
  typeName?:string
) => {
  const builtItems = {} as TExecuteOptsMap<I, C>

  await Object.entries(typeMap)
    .reduce(async (acc, [name, type]) => {
      await acc

      const built = type
        && await convertTypeStrToCls<I, C>(
            exam,
            type,
            options,
            typeName
          )

      built && built.length && (builtItems[name] = built)

      return acc
    }, Promise.resolve({} as TExecuteOptsMap<I, C>))

  return builtItems
}

export type TBuiltExecCfg = {
  exam:Exam
  options?:TLoadOpts
  config:TExamConfig
}

const buildPassThrough = (config:TExamConfig) => {
  return {
    transform: {
      ...TransformCfg,
      transformIgnore: config.transformIgnore || TransformCfg.transformIgnore
    },
    runner: {
      ...RunnerCfg,
      debug: config.debug ?? RunnerCfg.debug,
      verbose: config.verbose ?? RunnerCfg.verbose,
      timeout: isNum(config.timeout) ? config.timeout : RunnerCfg.timeout,
      omitTestResults: config.omitTestResults || RunnerCfg.omitTestResults,
      globalTimeout: isNum(config.globalTimeout) ? config.globalTimeout : RunnerCfg.globalTimeout,
    },
    environment: {
      ...EnvironmentCfg,
      envs: {...EnvironmentCfg.envs, ...config.envs},
      globals: {...EnvironmentCfg.globals, ...config.globals},
    }
  } as TExecPassThroughOpts
}

export const buildExecCfg = async ({
  exam,
  config,
  options
}:TBuiltExecCfg) => {
  const {
    runners,
    preRunner,
    postRunner,
    transforms,
    environment,
    preEnvironment,
    postEnvironment,
  } = config

  const loadedE = await convertTypeStrToCls<IExEnvironment<any, any>, TExEnvironmentCfg>(
    exam,
    environment,
    options,
    `Environments`
  )

  const loadedT = await loopLoadTypes<TExamTransforms,IExTransform,TExTransformCfg>(
    exam,
    transforms,
    options,
    `Transforms`
  )

  const loadedR = await loopLoadTypes<TExamRunners,IExRunner<any, any>,TExRunnerCfg>(
    exam,
    runners,
    options,
    `Runners`
  )

  return {
    exam,
    preRunner,
    postRunner,
    preEnvironment,
    postEnvironment,
    runners: loadedR,
    transforms: loadedT,
    environment: loadedE,
    passthrough: buildPassThrough(config),
  } as TExecuteCfg

}