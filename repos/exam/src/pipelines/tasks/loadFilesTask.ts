import { TPipelineArgs } from '@GEX/types'

import path from 'path'
import pMapSeries from 'p-map-series'
import {isArr} from '@keg-hub/jsutils'

const getLoc = (args:TPipelineArgs, loc:string) => {
  const { config } = args
  const { rootDir } = config

  return path.resolve(rootDir, loc)
}

const loadFilesObj = (
  args:TPipelineArgs,
  responses:Record<string, any>,
) => {
  const { state } = args

  return async ([name, file]) => {
    const [loc] = isArr(file) ? file : [file]
    const location = getLoc(args, loc)
    const mod = state.require(location)
    const loaded = mod.default || mod
    responses[name] = loaded

    return loaded
  }

}

const loadFileArr = (args:TPipelineArgs) => {
  const { state } = args

  return async (file:string|[string, Record<any, any>]) => {
    const [loc] = isArr(file) ? file : [file]
    const location = getLoc(args, loc)
    const mod = state.require(location)
    const loaded = mod.default || mod

    return loaded
  }
}


export const loadFilesTask = async (
  args:TPipelineArgs,
  files:Record<string, any>|string[]|[string, Record<any, any>][]
) => {

  if(isArr(files)){
    const looper = loadFileArr(args)
    return await pMapSeries(files, looper)
  }
  else {
    const responses = {}
    const looper = loadFilesObj(args, responses)
    const resp = await pMapSeries(Object.entries(files), looper)
    return responses
  }

}
