import type {
  TLoader,
  TCfgMerge,
  TLoopLoad,
  TLoadedFunc,
  TSearchFile,
  TRequiredFun,
  TGobletConfig,
  TLoadedFunResp,
  TGobletLoader
} from '../types'

import path from 'path'
import { globSync } from 'glob'
import { createRequire } from 'module'
import { isStr } from '@keg-hub/jsutils/isStr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { GobletConfigFileNames } from '../constants'
import { ensureGobletCfg } from '../utils/ensureGobletCfg'

type TBuildReqOpts = {
  safe?:boolean,
  clearCache?:boolean
  addLocation?:boolean
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


const flattenLoadedArr = <T>(data:T, items:TLoadedFunResp<T>[]) => {
  const onlyData = items?.length
    && items.map(item => item.data)

  // Merge all loaded data configs into a single object
  return onlyData ? deepMerge<T>(data, ...onlyData) : data
}

/**
 * Builds a require function for loading goblet configs dynamically
 */
const buildRequire = <T extends TCfgMerge>(basePath:string, opts:TBuildReqOpts) => {
  const {
    safe=false,
    clearCache=false,
    addLocation=false
  } = opts
  
  const relativeRequire = createRequire(basePath)
  return (
    location:string,
    inlineSafe:boolean=false,
    inlineClearCache:boolean=false
  ) => {

    try {
      const fullLoc =  noBasePath.find(start => location.startsWith(start))
        ? location
        : path.join(basePath, location)

      if(clearCache || inlineClearCache) delete require.cache[fullLoc]

      const data = relativeRequire(fullLoc) as T
      return data ? { data, location: fullLoc } : undefined

    }
    catch(err){
      if(safe || inlineSafe) return undefined

      throw err
    }
  }
}

/**
 * @description - Checks if the passed in world has a $merge property
 * If not, then returns the world object
 * If it does, then calls loop Loader Array method to load all paths
 * Once loaded, then merges each loaded world into a single world object
 * @recursive
 */
const loadWithMerge = <T extends TCfgMerge>(data:T, {
  merge,
  basePath,
  clearCache,
  requireFunc,
}:Omit<TLoopLoad<T>, `loadArr`>) => {

  if(merge === false || !data?.$merge || !data?.$merge?.length) return data

  const loadedArr = loopLoadArray<T>({
    basePath,
    clearCache,
    requireFunc,
    loadArr: data?.$merge,
  })

  return flattenLoadedArr(data, loadedArr)
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
    loadArr,
    basePath,
    clearCache,
    requireFunc,
  } = params

  const requireData = requireFunc || buildRequire(basePath, { safe, clearCache })
  
  const loadedArr:TLoadedFunResp<T>[] = [] as TLoadedFunResp<T>[]

  for (const loc of loadArr) {
    if(!isStr(loc)) continue;

    try {

      // Check if the path exists and try to load the file
      const resp = requireData(loc)
      if(!resp) continue;
      
      const { data: loadedData, location } = resp

      const dataByType = loadFromType(loadedData)
      if(!dataByType) continue;

      const loadedMerge = loadWithMerge<T>(dataByType, params)

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
export const loaderSearch = <T extends TCfgMerge>(params:TSearchFile):T => {

  const {
    file,
    safe,
    location,
    basePath,
    clearCache,
    ...rest
  } = params

  let data:T

  const requireFunc = buildRequire<T>(basePath, { safe, clearCache })

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

  return data
    ? loadWithMerge(data, { basePath, requireFunc })
    : undefined

}


/**
 * @description - Loads config files based on the passed in basePath and loadArr
 */
export const gobletLoader = (params:TGobletLoader):TGobletConfig|undefined => {
  const {
    ref,
    remote,
    basePath,
    safe=true,
    clearCache,
    first=true,
    addLocation,
  ...loadArgs
} = params

  const resp = loopLoadArray<TGobletConfig>({
    safe,
    first,
    basePath,
    addLocation,
    loadArr: GobletConfigFileNames,
    ...loadArgs,
    requireFunc: buildRequire(params.basePath, { safe, addLocation, clearCache }),
    // enforce not loading multiple goblet configs
    merge: false,
  })

  if(!resp || !resp?.length) return undefined

  const { data: config, location } = resp.pop()

  return ensureGobletCfg(config, {
    ref,
    remote,
    location,
    repoRoot: basePath
  }) as TGobletConfig

}
