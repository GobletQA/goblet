import type { TGobletConfig } from '../types'

import path from 'path'
import { globSync } from 'glob'
import { uniqArr } from '@keg-hub/jsutils'


const exts = [
  `js`,
  `cjs`,
  `mjs`,
  `ts`,
  `cts`,
  `mts`
]

/**
 * Finds all step definition files in client's step directory and
 * also in the config testUtilsDir repo
 * @param {Object} config - Global Goblet config
 *
 * @return {Array<string>} file paths
 */
export const getStepDefinitions = (config:TGobletConfig) => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, stepsDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const clientPattern = path.join(baseDir, stepsDir, `**/*.{${exts.join(',')}}`)
  const clientMatches = globSync(clientPattern)

  const configPattern = path.join(testUtilsDir, `src/steps/**/*.{${exts.join(',')}}`)
  const configMatches = globSync(configPattern)

  return uniqArr([...clientMatches, ...configMatches], undefined)
}

/**
 * Gets all file paths for bdd support files
 * @param {TGobletConfig} config - Global Goblet config
 *
 * @return {Array<string>} file paths
 */
export const getParkinSupport = (config:TGobletConfig) => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, supportDir } = config.paths

  const parkinEnvironment = `${testUtilsDir}/src/parkin/parkinTestInit.ts`

  // **IMPORTANT** - Must be loaded after the parkinEnvironment 
  const configHooks = `${testUtilsDir}/src/support/hooks.ts`

  const ignore = [`hook`, `hooks`, `setup`].reduce((acc, type) => {
    const built = exts.map(ext => `${type}.${ext}`)
    return acc.concat(built)
  }, []).join(`|`)
  
  // Don't include the world here because it gets loaded in config/support/world.json
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const pattern = path.join(baseDir, supportDir, `**/+(${ignore})`)
  const matches = globSync(pattern)

  // Add the default config hooks for setting up the tests
  // This adds a BeforeAll and AfterAll hook to the test execution
  // Were the `initialize` method from `playwrightTestEnv.js` is registered with the BeforeAll hook
  // This is where the browser for the test execution is created / connected to
  matches.unshift(configHooks)

  // MUST BE LOADED FIRST - Add the parkin environment setup before all other setup files
  // This ensures we can get access to the Parkin instance on the global object
  matches.unshift(parkinEnvironment)

  return matches
}
