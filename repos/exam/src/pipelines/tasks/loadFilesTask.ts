import { TPipelineArgs } from '@GEX/types'

import path from 'path'
import pMapSeries from 'p-map-series'
import {isArr} from '@keg-hub/jsutils/isArr'

type TPartialState = {
  require:NodeRequire
}

type TLoadFileArgs = Omit<TPipelineArgs, `state`|`rewind`> & {
  state:TPartialState
}

const getLoc = (args:TLoadFileArgs, loc:string) => {
  const { config } = args
  const { rootDir } = config

  return path.resolve(rootDir, loc)
}

const loadFilesObj = (
  args:TLoadFileArgs,
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

const loadFileArr = (args:TLoadFileArgs) => {
  const { state } = args

  return async (file:string|[string, Record<any, any>]) => {
    const [loc] = isArr(file) ? file : [file]
    const location = getLoc(args, loc)
    const mod = state.require(location)
    const loaded = mod.default || mod

    return loaded
  }
}


export const loadFilesTask = async <T extends Record<string|number, any>>(
  args:TLoadFileArgs,
  files:Record<string, any>|string[]|[string, Record<any, any>][]
):Promise<T> => {

  if(isArr(files)){
    const looper = loadFileArr(args)
    return await pMapSeries(files.filter(Boolean), looper) as unknown as T
  }
  else {
    const responses:T = {} as T
    const looper = loadFilesObj(args, responses)
    const resp = await pMapSeries(Object.entries(files), looper)

    return responses as T
  }

}
