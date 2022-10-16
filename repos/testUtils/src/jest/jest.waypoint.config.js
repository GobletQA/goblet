const { jestConfig } = require('./jest.default.config')

const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')
const { inDocker } = require('@keg-hub/cli-utils')
const { getGobletConfig } = require('@gobletqa/shared/utils/getGobletConfig')
const { getRepoGobletDir } = require('@gobletqa/shared/utils/getRepoGobletDir')
const { buildJestGobletOpts } = require('@GTU/Utils/buildJestGobletOpts')
const { taskEnvToBrowserOpts } = require('@gobletqa/screencast/libs/utils/taskEnvToBrowserOpts')
const { checkVncEnv } = require('@gobletqa/screencast/libs/utils/vncActiveEnv')
const metadata = require('@gobletqa/screencast/libs/playwright/helpers/metadata')
const { getContextOpts } = require('@gobletqa/screencast/libs/playwright/helpers/getContextOpts')
const { getBrowserOpts } = require('@gobletqa/screencast/libs/playwright/helpers/getBrowserOpts')

// TODO: investigate this to allow reusing it
// const { buildTestMatchFiles } = require('@gobletqa/shared/utils/buildTestMatchFiles')

/**
 * Builds the launch / browser options for the jest-playwright-config
 * @param {Object} config - Global Goblet config
 * @param {Object} taskOpts - Playwright browser options set by the task starting the process
 * 
 * @returns {Object} - Built browser options
 */
const buildLaunchOpts = async (config, taskOpts, optsKey) => {
  const { vncActive, socketActive } = checkVncEnv()
  const { endpoint, launchOptions } = await metadata.read(taskOpts.type)

  /**
   * Check if the websocket is active
   * If so, then update the endpoint url to target the host machine
   */
  const wsEndpoint = socketActive
    ? inDocker()
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint
    : false

  const opts = {[optsKey]: getBrowserOpts(launchOptions, config)}

  // If VNC is not active, then set the websocket endpoint
  if(!vncActive) opts[optsKey].wsEndpoint = wsEndpoint

  /**
   * Extra options set for browser to run, and devices to run 
   * Set from the task that started the process
   */
  opts.browsers = [taskOpts.type]
  taskOpts.devices &&
    (opts.devices = taskOpts.devices)

  return opts
}


/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = async () => {
  const config = getGobletConfig()
  const baseDir = getRepoGobletDir(config)
  const taskOpts = taskEnvToBrowserOpts(config)

  /**
   * Get the property base on if VNC is active or not
   * If not active we want to connect to the host machine browser via websocket
   * See
   *  - tasks/utils/envs/buildPWEnvs.js
   *  - repos/shared/src/utils/taskEnvToBrowserOpts.js
   */
  const { vncActive } = checkVncEnv()
  const optsKey = vncActive ? 'launchOptions' : 'connectOptions'
  const launchOpts = await buildLaunchOpts(config, taskOpts, optsKey)
  const browserOpts = launchOpts[optsKey]
  const gobletOpts = buildJestGobletOpts(config, browserOpts)
  const contextOpts = getContextOpts(noOpObj, config)

  const { testUtilsDir, reportsTempDir } = config.internalPaths
  const reportOutputPath = path.join(reportsTempDir, `${browserOpts.type}-html-report.html`)

  const defConf = jestConfig(config, {
    shortcut: 'wp',
    type: 'waypoint',
    reportOutputPath,
    testDir: path.join(baseDir, config.paths.waypointDir),
  })

  return {
    /** Build the default jest config for waypoint files */
    ...defConf,
    /** Define the goblet global options durring test runs */
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
        internalPaths: config.internalPaths,
      },
    },
    setupFilesAfterEnv: [
      `${testUtilsDir}/src/waypoint/hooks.js`,
      `${testUtilsDir}/src/waypoint/mockEnv.js`,
    ],
    /** Add the custom waypoint transformer for all found .feature files */
    transform: {
      // Add the custom waypoint transformer for waypoint files
      '^.*\\.(waypoint.js|wp.js|test.js|spec.js)$': `${testUtilsDir}/src/waypoint/transformer.js`,
      '^.*\\.(waypoint.ts|wp.ts|test.ts|spec.ts)$': `${testUtilsDir}/src/waypoint/transformer.js`,
      '^(waypoint|wp|test|spec)\\..*\\.(js)$': `${testUtilsDir}/src/waypoint/transformer.js`,
      '^(waypoint|wp|test|spec)\\..*\\.(ts)$': `${testUtilsDir}/src/waypoint/transformer.js`,
      ...defConf.transform,
    },
  }

}
