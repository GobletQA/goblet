import type {
  TCfgMerge,
  TLoopLoad,
  TSearchFile,
  TRequiredFun,
  TLoadedFunResp,
  TGobletConfig,
  TGobletLoader,
  TGobletCfgLoaderResp
} from '../types'

import path from 'path'
import { globSync } from 'glob'
import { Logger } from '@gobletqa/logger'
import { isStr } from '@keg-hub/jsutils/isStr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { ensureGobletCfg } from '../utils/ensureGobletCfg'
import { GobletConfigFileNames } from '@gobletqa/environment/constants'

import {
  resetRequire,
  getGobletCfg,
  setGobletCfg,
  getRelativeRequire,
} from './configCache'

type TBuildReqOpts = {
  safe?:boolean,
}


/**
 * Characters that define if a path
 */
const noBasePath = [`.`, `/`, `@`, `~`]

/**
 * Checks if the passed in config is a function and calls it if it is
 */
const loadFromType = <T extends TCfgMerge>(data:T) => {
  const loaded = typeof data === 'function'
    ?  (data as TRequiredFun<T>)() as T
    : data

  return loaded?.[`default`] ? loaded[`default`] : loaded
}



/**
 * Builds a require function for loading goblet configs dynamically
 */
const buildRequire = <T extends TCfgMerge>(basePath:string, opts:TBuildReqOpts) => {
  const {
    safe=false,
  } = opts
  
  const relativeRequire = getRelativeRequire(basePath)
  const localRequire = (
    location:string,
    inlineSafe:boolean=false,
  ) => {

    try {
      const fullLoc =  noBasePath.find(start => location.startsWith(start))
        ? location
        : path.join(basePath, location)

      const data = relativeRequire(fullLoc) as T
      return data ? { data, location: fullLoc } : undefined
    }
    catch(err){
      if(safe || inlineSafe) return undefined

      throw err
    }
  }

  return localRequire
}

/**
 * @description - Checks if the passed in world has a $merge property
 * If not, then returns the world object
 * If it does, then calls loop Loader Array method to load all paths
 * Once loaded, then merges each loaded world into a single world object
 * @recursive
 */
const loadWithMerge = <T extends TCfgMerge=TCfgMerge>(data:T, {
  basePath,
  clearCache,
  requireFunc,
}:Omit<TLoopLoad<T>, `loadArr`>) => {

  if(!data?.$merge || !data?.$merge?.length) return data

  const loadedArr = loopLoadArray<T>({
    basePath,
    clearCache,
    requireFunc,
    loadArr: data?.$merge,
  })

  // Extract the data field from the loadedArr which has data & location
  const mergeData = loadedArr?.length && loadedArr.map(item => item.data)

  return mergeData
    ? deepMerge<T>(data, ...mergeData)
    : data
}

/**
 * @description - Loops over an array of paths, and tries to require each one
 * @first - if true, will return the loaded file as an array of 1
 * Otherwise returns all loaded files content in an array
 * If the loaded config has a $merge property that is an array of string
 * It will recursively call it's self to load those files as well
 * @recursive
 */
const loopLoadArray = <T extends TCfgMerge>(params:TLoopLoad<T>):TLoadedFunResp<T>[] => {
  const {
    type,
    safe,
    first,
    merge,
    loadArr,
    basePath,
    requireFunc,
  } = params

  const requireData = requireFunc || buildRequire(basePath, { safe })
  
  const loadedArr:TLoadedFunResp<T>[] = [] as TLoadedFunResp<T>[]

  for (const loc of loadArr) {
    if(!isStr(loc)) continue;

    try {

      // Check if the path exists and try to load the file
      const resp = requireData(loc)
      if(!resp) continue;
      
      const { data: loadedData, location } = resp

      const dataByType = loadFromType(loadedData)
      if(!dataByType){

        if(loadedData){
          Logger.error(`Data was loaded for "loopLoadArray", but no data is being returned`)
          Logger.info(`Data:`, loadedData)
          Logger.info(`Load From Type:`, dataByType)
        }

        continue;
      }

      const loadedMerge = merge ? loadWithMerge<T>(dataByType, params) : dataByType

      if(loadedMerge && first)
        return [{ data: loadedMerge, location }] as TLoadedFunResp<T>[]

      loadedArr.push({ data: loadedMerge, location })
    }
    catch(err){
      console.log(`Error loading data ${type || 'in loader array method'}...`)
      console.log(err.stack)
    }
  }

  return loadedArr
}

/**
 * Searches for a file based on the passed in basePath and fileName
 * If a location is passed, will load that first
 * Then search's for a matching file by name
 * Is loaded file has a $merge array property, will try to load all paths from it
 */
export const repoWorldLoader = <T extends TCfgMerge>(params:TSearchFile):T => {

  const {
    file,
    safe,
    merge,
    location,
    basePath,
    clearCache,
  } = params

  let data:T
  if(clearCache) resetRequire(path.dirname(basePath))

  const requireFunc = buildRequire<T>(basePath, { safe })

  // If a location is passed, try to load it
  if(location){
    const resp = requireFunc(location)
    data = resp?.data
  }

  // If no data has loaded, the try to search for it
  if(!data){
    const resp = globSync(path.join(basePath, `**/${file}`))
      .reduce(
        (found:TLoadedFunResp<T>, file:string) => found || requireFunc(file, true),
        undefined
      )

    if(resp) data = resp?.data as T
  }

  const loadedData = data
    ? loadWithMerge(data, { basePath, requireFunc })
    : undefined
  
  if(!loadedData && data){
    Logger.error(`Data was loaded for "repoWorldLoader", but no data is being returned`)
    Logger.info(`Data:`, data)
    Logger.info(`LoadedData:`, loadedData)
  }

  return loadedData
}


/**
 * @description - Loads config files based on the passed in basePath and loadArr
 */
export const gobletLoader = (params:TGobletLoader):TGobletCfgLoaderResp|undefined => {
  const cached = getGobletCfg()
  if(cached) return cached

  const {
    ref,
    remote,
    basePath,
    safe=true,
    clearCache,
    first=true,
  ...loadArgs
} = params

  if(clearCache) resetRequire(basePath)

  const loadArrArgs = {
    safe,
    first,
    basePath,
    loadArr: GobletConfigFileNames,
    ...loadArgs,
    requireFunc: buildRequire(params.basePath, { safe }),
    // enforce not loading multiple goblet configs
    merge: false,
  }

  const resp = loopLoadArray<TGobletConfig>(loadArrArgs as TLoopLoad<TGobletConfig>)

  const { data: config, location } = resp.pop()

  const loaded = ensureGobletCfg(config, {
    ref,
    remote,
    location,
    repoRoot: basePath
  })

  return setGobletCfg(loaded)
}
