import type { TRunnerCls, TPipelineArgs, TStateObj, IExamRunner } from "@GEX/types"

import { promises } from 'fs'
import pMapSeries from 'p-map-series'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import {toFileModel} from "@GEX/utils/toFileModel"
import {ensureArr} from "@keg-hub/jsutils/ensureArr"
import {typeClassFromLoc} from "@GEX/utils/typeClassFromLoc"

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

  const looper = getTestRunner(args, {
    bail: config.bail,
    debug: config.debug,
    omitTestResults: [],
    verbose: config.verbose,
    timeout: config.timeout,
    globalTimeout: config.globalTimeout,
    ...state?.passthrough?.runner,
  }, CacheRunners)

  const withRunners = await pMapSeries(ensureArr(testMatch), looper)
  // Clear the cache after loading all runners
  CacheRunners = {}

  return withRunners
}