import type {
  TLoader,
  TCfgMerge,
  TLoopLoad,
  TLoadedFunc,
  TSearchFile,
  TRequiredFun,
  TGobletConfig,
  TLoadedFunResp
} from '../types'

import path from 'path'
import { globSync } from 'glob'
import { createRequire } from 'module'
import { isStr } from '@keg-hub/jsutils/isStr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { GobletConfigFileNames } from '../constants'

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
  requireFunc
}:Omit<TLoopLoad<T>, `loadArr`>) => {

  if(merge === false || !data?.$merge || !data?.$merge?.length) return data

  const loadedArr = loopLoadArray({
    basePath,
    requireFunc,
    loadArr: data?.$merge,
  })

  // Merge all loaded data configs into a single object
  return deepMerge<T>(data, ...loadedArr)
}

/**
 * @description - Loops over an array of paths, and tries to require each one
 * @first - if true, will return the loaded file as an array of 1
 * Otherwise returns all loaded files content in an array
 * If the loaded config has a $merge property that is an array of string
 * It will recursively call it's self to load those files as well
 * @recursive
 */
const loopLoadArray = <T extends TCfgMerge>(params:TLoopLoad<T>) => {
  const {
    type,
    safe,
    first,
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
      if(!dataByType) continue;

      const loadedMerge = loadWithMerge(dataByType, params)

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
export const loaderSearch = <T extends TCfgMerge>(params:TSearchFile) => {

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

  // If no data or, no $merge array, then return data
  if(!data?.$merge || !data?.$merge?.length) return data as T

  // If there is a merge array, try to load the them
  const loadedData = loopLoadArray<T>({
    ...rest,
    safe,
    basePath,
    requireFunc,
    loadArr: data.$merge,
  })

  // Merge all loaded data into a single Object
  return deepMerge<T>(data, ...loadedData)
}


/**
 * @description - Loads config files based on the passed in basePath and loadArr
 */
export const gobletLoader = (params:TLoader):TGobletConfig|undefined => {
  const {
    basePath,
    safe=true,
    first=true,
    addLocation,
  ...loadArgs
} = params

  const loadedData = loopLoadArray<TGobletConfig>({
    safe,
    first,
    basePath,
    addLocation,
    loadArr: GobletConfigFileNames,
    ...loadArgs,
    requireFunc: buildRequire(params.basePath, { safe, addLocation }),
    // enforce not loading multiple goblet configs
    merge: false,
  })

  if(!loadedData?.length) return undefined

  const config = loadedData.pop()

  // Merge all loaded configs into a single config file
  // const config = first || loadedData?.length <= 1
  //   ? loadedData.pop() as TGobletConfig | undefined
  //   : deepMerge<TGobletConfig>(...loadedData) as TGobletConfig

  // Ensure the repoRoot path gets set
  // This should never happen because it's enforce when the repo is mounted
  // But its a hold over from the past
  // So keeping it for now until I can validate it's not needed
  !config?.paths?.repoRoot
    && (config.paths = {...config?.paths, repoRoot: basePath })

  return config as TGobletConfig
}
