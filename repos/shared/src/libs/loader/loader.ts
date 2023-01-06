
import fs  from 'fs'
import path from 'path'
import glob from 'glob'
import { createRequire } from 'module'
import { isStr, deepMerge } from '@keg-hub/jsutils/src/node'

type TMerge = { merge?: string[] }
type TLoadedFunc<T extends TMerge> = (...args:any[]) => T

type TLoopLoad<T extends TMerge> = TLoader & {
  requireFunc?:TLoadedFunc<T>,
}

type TLoadShared = {
  key?:string
  type?:string
  first?: boolean
  basePath:string
}

type TSearchFile = TLoadShared & {
  file:string
  location?:string
}


export type TLoader = TLoadShared & {
  loadArr:string[]
}

/**
 * Characters that define if a path
 */
const noBasePath = [`.`, `/`, `@`, `~`]


const tryRequire = <T>(requireFunc:TLoadedFunc<T>, location:string) => {
  try { return requireFunc(location) }
  catch(err){}
}

/**
 * Checks if the passed in config is a function and calls it if it is
 */
export const loadFromType = <T extends TMerge>(data:T, key:string=`default`, ...args:any[]) => {
  const loaded = typeof data === 'function'
    ?  (data as TLoadedFunc<T>)(...args) as T
    : data

  return loaded?.[key] ? loaded[key] : loaded
}

/**
 * Builds a require function for loading goblet configs dynamically
 */
export const buildRequire = <T extends TMerge>(basePath:string) => {
  const relativeRequire = createRequire(basePath)
  return (location:string) => {
    const fullLoc =  noBasePath.find(start => location.startsWith(start))
      ? location
      : path.join(basePath, location)

    return relativeRequire(fullLoc) as T
  }
}

/**
 * @description - Checks if the passed in world has a merge property
 * If not, then returns the world object
 * If it does, then calls loopLoadArray to load the paths
 * Once loaded, then merges each loaded world into a single world object
 * @recursive
 */
const loadWithMerge = <T extends TMerge>(data:T, {
  basePath,
  requireFunc
}:Omit<TLoopLoad<T>, `loadArr`>) => {

  if(!data?.merge?.length) return data

  const loadedArr = loopLoadArray({
    basePath,
    requireFunc,
    loadArr: data?.merge,
  })

  // Merge all loaded data configs into a single object
  return deepMerge<T>(data, ...loadedArr)
}

/**
 * @description - Loops over an array of paths, and tries to require each one
 * @first - if true, will return the loaded file as an array of 1
 * Otherwise returns all loaded files content in an array
 * If the loaded config has a merge property that is an array of string
 * It will recursively call it's self to load those files as well
 * @recursive
 */
const loopLoadArray = <T extends TMerge>(params:TLoopLoad<T>):T[] => {
  const {
    key,
    type,
    first,
    loadArr,
    basePath,
    requireFunc,
  } = params

  const requireData = requireFunc || buildRequire(basePath)
  
  const loadedArr:T[] = [] as T[]

  for (const loc of loadArr) {
    if(!isStr(loc)) continue;

    try {

      // Check if the path exists and try to load the file
      const loadedData = fs.existsSync(path.join(basePath, loc))
        ? requireData(loc)
        : null

      if(!loadedData) continue;

      const dataByType = loadFromType(loadedData, key)
      if(!dataByType) continue;

      const loadedMerge = loadWithMerge(dataByType, params)

      if(loadedMerge && first) return [loadedMerge] as T[]

      loadedArr.push(loadedMerge)
    }
    catch(err){
      console.log(`Error loading data ${type || 'in loopLoadArray'}...`)
      console.error(err.stack)
    }
  }

  return loadedArr
}

/**
 * Searches for a file based on the passed in basePath and fileName
 * If a location is passed, will load that first
 * Then search's for a matching file by name
 * Is loaded file has a merge array property, will try to load all paths from it
 */
export const loaderSearch = <T extends TMerge>(params:TSearchFile) => {

  const {
    file,
    location,
    basePath,
    ...rest
  } = params

  let data:T

  const requireFunc = buildRequire<T>(basePath)

  // If a location is passed, try to load it
  if(location) data = requireFunc(location)
  
  // If no data has loaded, the try to search for it
  if(!data){
    data = glob
      .sync(path.join(basePath, `**/${file}`))
      .reduce(
        (found:T, file:string) => found || tryRequire<T>(requireFunc, file),
        undefined
      ) as T
  }

  // If no data or, no merge array, then return data
  if(!data?.merge?.length) return data as T

  // If there is a merge array, try to load the them
  const loadedData = loopLoadArray<T>({
    ...rest,
    basePath,
    requireFunc,
    loadArr: data.merge,
  })

  // Merge all loaded data into a single Object
  return deepMerge<T>(data, ...loadedData)

}


/**
 * @description - Loads config files based on the passed in basePath and loadArr
 */
export const loader = <T extends TMerge>(params:TLoader) => {

  const loadedData = loopLoadArray<T>({
    ...params,
    requireFunc: buildRequire(params.basePath),
  })

  // Merge all loaded configs into a single config file
  return loadedData?.length ? deepMerge<T>(...loadedData) : undefined

}
