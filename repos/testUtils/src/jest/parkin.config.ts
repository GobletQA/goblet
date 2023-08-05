import type { TBrowserConf, TGobletConfig } from '../types'

// Must load this first because it loads the alias
import { jestConfig } from './jest.default.config'

import path from 'path'
import { globSync } from 'glob'
import { uniqArr, flatUnion, ensureArr } from '@keg-hub/jsutils'
import { buildTestGobletOpts } from '@GTU/Utils/buildTestGobletOpts'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'
import { getRepoGobletDir } from '@gobletqa/shared/utils/getRepoGobletDir'
import {
  getContextOpts,
  taskEnvToBrowserOpts
} from '@gobletqa/browser'

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
const getStepDefinitions = (config:TGobletConfig) => {
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
const getParkinSupport = (config:TGobletConfig) => {
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

export const parkinConfig =  async () => {
  const config = getGobletConfig()
  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(config)
  const browserConf = browserOpts as TBrowserConf
  const gobletOpts = buildTestGobletOpts(config, browserConf)
  const contextOpts = getContextOpts({ config })

  const { testUtilsDir, reportsTempDir } = config.internalPaths
  const reportOutputPath = path.join(reportsTempDir, `${browserConf.type}-html-report.html`)
  const defConf = jestConfig(config, {
    type: `bdd`,
    ext: `feature`,
    title: `Feature`,
    reportOutputPath,
    rootDir: config.paths.repoRoot,
    testDir: path.join(baseDir, config.paths.featuresDir),
  })

  return {
    ...defConf,
    /** Add feature as an extension that can be loaded */
    moduleFileExtensions: [
      `feature`,
      ...defConf.moduleFileExtensions,
    ],
    /** Pass on the browser options defined from the task that started the process */
    globals: {
      ...defConf.globals,
      __goblet: {
        paths: {
          ...config.paths,
          reportTempPath: reportOutputPath
        },
        options: gobletOpts,
        browser: browserOpts,
        context: { options: contextOpts },
      },
    },
    /** Add all support and step files and ensure they are loaded before running the tests */
    setupFilesAfterEnv: flatUnion([
      ...ensureArr(defConf.setupFilesAfterEnv),
      ...getParkinSupport(config),
      ...getStepDefinitions(config),
    ]),
    /** Add the custom Parkin transformer for all found .feature files */
    transform: {
      ...defConf.transform,
      // Add the custom parkin transformer for feature files
      '^.*\\.feature': `${testUtilsDir}/src/parkin/transformer.ts`,
    },
  }
}
