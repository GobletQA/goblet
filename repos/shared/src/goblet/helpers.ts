import type { TGobletConfig } from '../types'

import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { isStr, isFunc, deepMerge } from '@keg-hub/jsutils'

type TGobletLoaded = ((...args:any[]) => TGobletConfig) | TGobletConfig
type TRequireFunc<T=TGobletLoaded> = (loc:string) => T

type TLoopLoad = {
  onlyOne?:boolean
  loadArr:string[]
  basePath:string
  requireFunc?:TRequireFunc<TGobletLoaded>,
}

/**
 * Checks if the passed in config is a function and calls it if it is
 * @param {Object|function} config - Config to be loaded
 *
 * @return {*} - The response of the config function, or the config if it's not a function
 */
export const loadConfigByType = (
  config:TGobletLoaded,
  ...args:any[]
  ) => {
  return isFunc(config) ? config(...args) : config
}

/**
 * Builds a require function for loading goblet configs dynamically
 */
const buildRequire = (basePath:string) => {
  const relativeRequire = createRequire(basePath)
  // Create require is relative to the parent directory of the basePath
  // So we get the dir name so it can be added when relativeRequire is called
  const dirName = basePath.split(`/`).pop()

  return (location:string) => relativeRequire(path.join(dirName, location))
}

/**
 * @description - Loops over an array of paths, and tries to require each one
 * @onlyOne - if true, will return the loaded file as an array of 1
 * Otherwise returns all loaded files content in an array
 * If the loaded config has a merge property that is an array of string
 * It will recursively call it's self to load those files as well
 * @recursive
 */
const loopLoadArray = (params:TLoopLoad):TGobletConfig[] => {
  const {
    loadArr,
    onlyOne,
    basePath,
    requireFunc,
  } = params

  const requireConfig = requireFunc || buildRequire(basePath)
  
  const loadedArr:TGobletConfig[] = [] as TGobletConfig[]

  for (const loc of loadArr) {
    if(!isStr(loc)) continue;

    try {

      // Check if the path exists and try to load the file
      const loaded = fs.existsSync(path.join(basePath, loc))
        ? requireConfig(loc)
        : null

      if(!loaded) continue;

      const loadedType = loadConfigByType(loaded as TGobletLoaded)
      if(!loadedType)  continue;

      const loadedMerge = loadWithMerge(loadedType, params)

      if(loaded && onlyOne) return [loadedMerge] as TGobletConfig[]

      loadedArr.push(loadedMerge)
    }
    catch(err){
      console.log(`Error loading repo config...`)
      console.error(err.stack)
    }
  }

  return loadedArr
}

/**
 * @description - Checks if the passed in config has a merge property
 * If not, then returns the config
 * If it does, then calls loopLoadArray to load the paths
 * Once loaded, then merges each loaded config into a single config object
 * @recursive
 */
const loadWithMerge = (config:TGobletConfig, {
  basePath,
  requireFunc
}:TLoopLoad) => {

  if(!config?.merge?.length) return config

  const loadedArr = loopLoadArray({
    basePath,
    requireFunc,
    loadArr: config?.merge,
  })

  // Merge all loaded configs into a single config file
  return deepMerge<TGobletConfig>(config, ...loadedArr)
}

/**
 * @description - Tries to find the goblet.config.json file from the passed in basePath
 */
export const configAtPath = (basePath:string) => {
  const loadedArr = loopLoadArray({
    basePath,
    onlyOne: true,
    requireFunc: buildRequire(basePath),
    loadArr: [
      `.gobletrc`,
      `.gobletrc.json`,
      `goblet.json`,
      `goblet.config.json`,
    ],
  })

  // Merge all loaded configs into a single config file
  return deepMerge<TGobletConfig>(...loadedArr)
}


/**
 * Loops through the possible folder locations
 * and calls configAtPath for each one
 */
export const configFromFolder = (baseDir:string) => {
  return [
    ``,
    `./config`,
    `./configs`,
    `./goblet`,
    `./test`,
    `./tests`
  ].reduce((found:false|TGobletConfig, loc) => (
    found || configAtPath(path.join(baseDir, loc)) || found
  ),
    false
  )
}

/**
 * Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 */
export const findConfig = (startDir?:string) => {
  let currentPath = startDir || process.cwd()
  while (currentPath != '/') {
    const configAtPath = configFromFolder(currentPath)
    if (configAtPath) return configAtPath
    currentPath = path.join(currentPath, '../')
  }
  return null
}
