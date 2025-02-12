import type { TGobletConfig } from '../types'
import type { GlobOptions } from 'glob'

import path from 'node:path'
import { globSync } from 'glob'
import { uniqArr } from '@keg-hub/jsutils/uniqArr'
import { checkDistDir } from '@GTU/Utils/checkDistDir'
import { InternalPaths, GlobOnlyFiles, GlobJSFiles } from '@gobletqa/environment/constants'

const getGlobFiles = (
  location:string,
  pattern:string=GlobJSFiles,
  opts?:GlobOptions
) => {
  // Load all default goblet step definitions
  return globSync(pattern, {
    ...GlobOnlyFiles,
    ...opts,
    cwd: location
  })
}

/**
 * Finds all step definition files in client's step directory and
 * also in the config testifyDir repo
 * @param {Object} config - Global Goblet config
 *
 * @return {Array<string>} file paths
 */
export const getStepDefinitions = (config:TGobletConfig) => {
  const { testifyDir } = InternalPaths
  const { repoRoot, workDir, stepsDir, supportDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const {ext, from} = checkDistDir(__dirname, ``)

  // **IMPORTANT** - Must be loaded after the getParkinTestInit method
  // Load these postEnvironment setup
  // Load getParkinTestInit preEnvironment or during environment setup 
  return uniqArr([
    path.join(testifyDir, from, `support/hooks.${ext}`),
    // Load all default goblet step definitions
    ...getGlobFiles(path.join(testifyDir, from, `steps`)),
    // Load all client supporting files, i.e. custom hooks
    ...getGlobFiles(path.join(baseDir, supportDir)),
    // Load all client custom step definitions
    ...getGlobFiles(path.join(baseDir, stepsDir)),
  ], undefined)
}


/**
 * Loaded in the preEnvironment step, to ensure Parkin exists in the global scope
 */
export const getParkinTestInit = (config:TGobletConfig) => {
  const { testifyDir } = InternalPaths
  const {ext, from} = checkDistDir(__dirname, ``)

  // MUST BE LOADED FIRST - Add the parkin environment setup before all other setup files
  // This ensures we can get access to the Parkin instance on the global object
  return [
    path.join(testifyDir, from, `parkin/parkinTestInit.${ext}`)
  ]
}
