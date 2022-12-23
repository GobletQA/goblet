import type { TGobletConfig } from '../types'


import fs from 'fs'
import path from 'path'
import { isFunc } from '@keg-hub/jsutils'


/**
 * Tries to find the goblet.config.js(on) file at `cwd`
 */
export const configAtPath = (pathToCheck:string) => {

  const validNames = [
    '.gobletrc',
    `.gobletrc.json`,
    `.gobletrc.yaml`,
    `.gobletrc.yml`,
    `.gobletrc.js`,
    `.gobletrc.cjs`,
    `.gobletrc.mjs`,
    `.gobletrc.ts`,
    `.gobletrc.cts`,
    `.gobletrc.mts`,
    `goblet.config.json`,
    `goblet.config.js`,
    `goblet.config.cjs`,
    `goblet.config.mjs`,
    `goblet.config.ts`,
    `goblet.config.cts`,
    `goblet.config.mts`
  ]

  const paths = validNames.map(name => path.join(pathToCheck, name))

  for (const loc of paths) {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[loc]
    try {
      // TODO: typescript - update this to allow loading .ts file extensions
      const config = fs.existsSync(loc) ? require(loc) : null
      if (config) return loadConfigByType(config)
    }
    catch(err){
      console.log(`Error loading repo config...`)
      console.error(err.stack)
    }
  }

  return null
}


/**
 * Loops through the possible folder locations
 * and calls configAtPath for each one
 */
export const configFromFolder = (baseDir:string) => {
  return [
    '',
    './config',
    './configs',
    './goblet',
    './test',
    './tests'
  ].reduce((found:any, loc) => found || configAtPath(path.join(baseDir, loc) || found),
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



/**
 * Checks if the passed in config is a function and calls it if it is
 * @param {Object|function} config - Config to be loaded
 *
 * @return {*} - The response of the config function, or the config if it's not a function
 */
export const loadConfigByType = (
  config:(...args:any[]) => TGobletConfig,
  ...args:any[]
  ) => {
  return isFunc(config) ? config(...args) : config
}
