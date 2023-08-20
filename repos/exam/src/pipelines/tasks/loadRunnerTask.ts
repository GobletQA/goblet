import type { TPipelineArgs, TStateObj } from "@GEX/types"

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
) => {
  const { state } = args
  const runners = state.RunnerClasses

  return async (location:string) => {
    const content = await readFile(location, `utf8`)
    const model = toFileModel({ location, content })
    const runnerCls = typeClassFromLoc(model, runners)
    const RunCls = runnerCls || BaseRunner

    return {
      model,
      // @ts-ignore
      Runner: new RunCls(opts, state)
    }
  }
}


export const loadRunnerTask = async (args:TPipelineArgs) => {
  const { config, state, testMatch } = args

  const looper = getTestRunner(args, {
    bail: config.bail,
    debug: config.debug,
    omitTestResults: [],
    verbose: config.verbose,
    timeout: config.timeout,
    globalTimeout: config.globalTimeout,
    ...state?.passthrough?.runner,
  })

  return await pMapSeries(ensureArr(testMatch), looper)

}