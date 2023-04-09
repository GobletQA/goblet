// Must load this first because it loads the alias
const { jestConfig } = require('./jest.default.config')

const path = require('path')
const glob = require('glob')
const { getGobletConfig } = require('@gobletqa/shared/goblet/getGobletConfig')
const { uniqArr, noOpObj } = require('@keg-hub/jsutils')
const { getRepoGobletDir } = require('@gobletqa/shared/utils/getRepoGobletDir')
const { buildJestGobletOpts } = require('@GTU/Utils/buildJestGobletOpts')
const { taskEnvToBrowserOpts } = require('@gobletqa/screencast/libs/utils/taskEnvToBrowserOpts')
const { getContextOpts } = require('@gobletqa/screencast/libs/playwright/helpers/getContextOpts')

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
const getStepDefinitions = config => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, stepsDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const clientPattern = path.join(baseDir, stepsDir, `**/*.{${exts.join(',')}}`)
  const clientMatches = glob.sync(clientPattern)

  const configPattern = path.join(testUtilsDir, `src/steps/**/*.{${exts.join(',')}}`)
  const configMatches = glob.sync(configPattern)

  return uniqArr([...clientMatches, ...configMatches])
}

/**
 * Gets all file paths for bdd support files
 * @param {Object} config - Global Goblet config
 *
 * @return {Array<string>} file paths
 */
const getParkinSupport = config => {
  const { testUtilsDir } = config.internalPaths
  const { repoRoot, workDir, supportDir } = config.paths

  const parkinEnvironment = `${testUtilsDir}/src/parkin/parkinTestInit.ts`

  // **IMPORTANT** - Must be loaded after the parkinEnvironment 
  const configHooks = `${testUtilsDir}/src/support/hooks`

  const ignore = [`hook`, `hooks`, `setup`].reduce((acc, type) => {
    const built = exts.map(ext => `${type}.${ext}`)
    return acc.concat(built)
  }, []).join(`|`)
  
  // Don't include the world here because it gets loaded in config/support/world.json
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  const pattern = path.join(baseDir, supportDir, `**/+(${ignore})`)
  const matches = glob.sync(pattern)

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

module.exports = async () => {
  const config = getGobletConfig()
  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(config)
  const gobletOpts = buildJestGobletOpts(config, browserOpts)
  const contextOpts = getContextOpts(noOpObj, config)

  const { testUtilsDir, reportsTempDir } = config.internalPaths
  const reportOutputPath = path.join(reportsTempDir, `${browserOpts.type}-html-report.html`)
  const defConf = jestConfig(config, {
    type: `bdd`,
    ext: 'feature',
    title: 'Feature',
    reportOutputPath,
    testDir: path.join(baseDir, config.paths.featuresDir),
  })

  return {
    ...defConf,
    /** Add feature as an extension that can be loaded */
    moduleFileExtensions: [
      'feature',
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
        browser: { options: browserOpts },
        context: { options: contextOpts },
      },
    },
    /** Add all support and step files and ensure they are loaded before running the tests */
    setupFilesAfterEnv: [
      ...getParkinSupport(config),
      ...getStepDefinitions(config),
    ],
    /** Add the custom Parkin transformer for all found .feature files */
    transform: {
      ...defConf.transform,
      // Add the custom parkin transformer for feature files
      '^.*\\.feature': `${testUtilsDir}/src/parkin/transformer.ts`,
    },
  }
}
