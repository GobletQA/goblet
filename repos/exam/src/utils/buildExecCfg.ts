import type { Exam } from '@GEX/Exam'
import type {
  TExTypeCls,
  TExTypeCfg,
  TExTypeMap,
  IExRunner,
  TExRunnerCfg,
  IExTransform,
  TExTransformCfg,
  IExEnvironment,
  TEnvironmentCfg,
  TLoadOpts,
  TExecuteCfg,
  TExamConfig,
  TExamRunners,
  TExecuteOptsMap,
  TExamTransformers,
  TExamEnvironments,
} from '@GEX/types'

import { convertTypeStrToCls } from './convertTypeStrToCls'

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

export const buildExecCfg = async ({
  exam,
  config,
  options
}:TBuiltExecCfg) => {
  const {
    execute,
    runners,
    transformers,
    environments,
  } = config

  const loadedE = await loopLoadTypes<TExamEnvironments,IExEnvironment,TEnvironmentCfg>(
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
    options: execute,
    runners: loadedR,
    transformers: loadedT,
    environments: loadedE,
  } as TExecuteCfg

}