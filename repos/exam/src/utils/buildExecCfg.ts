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
  TExEnvironmentCfg,
  TExamTransformers,
  TExamEnvironments,
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
  options:TLoadOpts
) => {
  return Object.entries(typeMap)
    .reduce(async (acc, [name, type]) => {
      await acc

      const built = type
        && await convertTypeStrToCls<I, C>(
            exam,
            type,
            options
          )

      built && built.length && (acc[name] = built)

      return acc
    }, Promise.resolve({} as TExecuteOptsMap<I, C>))
}

export type TBuiltExecCfg = {
  exam:Exam
  config:TExamConfig
  options?:TLoadOpts
}

const buildPassThrough = (config:TExamConfig) => {
  return {
    transform: {
      ...TransformCfg,
      transformIgnore: config.transformIgnore || TransformCfg.transformIgnore
    },
    runner: {
      debug: config.debug ?? RunnerCfg.debug,
      verbose: config.verbose ?? RunnerCfg.verbose,
      timeout: isNum(config.timeout) ? config.timeout : RunnerCfg.timeout,
      globalTimeout: isNum(config.globalTimeout) ? config.globalTimeout : RunnerCfg.globalTimeout,
    },
    environment: {
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
    transformers,
    environments,
    preEnvironment,
    postEnvironment,
  } = config

  const loadedE = await loopLoadTypes<TExamEnvironments,IExEnvironment,TExEnvironmentCfg>(
    exam,
    environments,
    options
  )

  const loadedT = await loopLoadTypes<TExamTransformers,IExTransform,TExTransformCfg>(
    exam,
    transformers,
    options
  )
  const loadedR = await loopLoadTypes<TExamRunners,IExRunner,TExRunnerCfg>(
    exam,
    runners,
    options
  )

  return {
    exam,
    preEnvironment,
    postEnvironment,
    runners: loadedR,
    transformers: loadedT,
    environments: loadedE,
    passthrough: buildPassThrough(config),
  } as TExecuteCfg

}