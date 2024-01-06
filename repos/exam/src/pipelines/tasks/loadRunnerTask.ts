import type { TRunnerCls, TPipelineArgs, IExamRunner } from "@GEX/types"

import { promises } from 'fs'
import {toFileModel} from '@GEX/utils/toFileModel'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import {ensureArr} from '@keg-hub/jsutils/ensureArr'
import { promiseSeries } from '@GEX/utils/promiseSeries'
import {typeClassFromLoc} from '@GEX/utils/typeClassFromLoc'

const { readFile } = promises

const getTestRunner = (
  args:TPipelineArgs,
  opts:Record<any, any>,
  CacheRunners:Record<string, IExamRunner<any>>
) => {
  const { state, config } = args
  const runners = state.RunnerClasses
  const reuseRunner = config.reuseRunner

  const withRunner = async (location:string) => {
    const content = await readFile(location, `utf8`)
    const model = toFileModel({ location, content })
    const { found, type } = typeClassFromLoc<TRunnerCls<any>>(model, runners)

    const RunCls = found || BaseRunner
    CacheRunners[type] = (reuseRunner && CacheRunners[type]) || new RunCls(opts, state)

    return {
      model,
      Runner: CacheRunners[type]
    }
  }

  return withRunner
}


export const loadRunnerTask = async (args:TPipelineArgs) => {
  const { config, state, testMatch } = args
  let CacheRunners = {} as Record<string, IExamRunner<any>>

  const looper = getTestRunner(args, {...state?.passthrough?.runner}, CacheRunners)

  const withRunners = await promiseSeries(ensureArr(testMatch), looper)
  // Clear the cache after loading all runners
  CacheRunners = {}

  return withRunners
}