const { jestConfig } = require('./jest.default.config')

const path = require('path')
const { checkVncEnv } = require('@gobletqa/shared/utils/vncActiveEnv')
const { buildTestGobletOpts } = require('@GTU/Utils/buildTestGobletOpts')
const { getRepoGobletDir, getGobletConfig } = require('@gobletqa/goblet')
const {
  metadata,
  getBrowserOpts,
  getContextOpts,
  taskEnvToBrowserOpts
} = require('@gobletqa/browser')

// TODO: investigate this to allow reusing it
// const { buildTestMatchFiles } = require('@gobletqa/shared/utils/buildTestMatchFiles')

// TODO: Fix this - @cli-utils inDocker method no longer works
const inDocker = () => true

/**
 * Builds the launch / browser options for the jest-playwright-config
 * @param {Object} config - Global Goblet config
 * @param {Object} taskOpts - Playwright browser options set by the task starting the process
 * 
 * @returns {Object} - Built browser options
 */
const buildLaunchOpts = async (config, taskOpts, optsKey) => {
  metadata.config = config

  const { vncActive, socketActive } = checkVncEnv()
  const { endpoint, browserConf } = await metadata.read(taskOpts.type)

  /**
   * Check if the websocket is active
   * If so, then update the endpoint url to target the host machine
   */
  const wsEndpoint = socketActive
    ? inDocker()
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint
    : false

  const opts = {[optsKey]: getBrowserOpts(browserConf, config)}

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
  const gobletOpts = buildTestGobletOpts(config, browserOpts)
  const contextOpts = getContextOpts({ config })

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
      `${testUtilsDir}/src/waypoint/hooks.ts`,
      `${testUtilsDir}/src/waypoint/mockEnv.ts`,
    ],
    /** Add the custom waypoint transformer for all found .feature files */
    transform: {
      // Add the custom waypoint transformer for waypoint files
      '^.*\\.(waypoint.js|wp.js|test.js|spec.js)$': `${testUtilsDir}/src/waypoint/transformer.ts`,
      '^.*\\.(waypoint.ts|wp.ts|test.ts|spec.ts)$': `${testUtilsDir}/src/waypoint/transformer.ts`,
      '^(waypoint|wp|test|spec)\\..*\\.(js)$': `${testUtilsDir}/src/waypoint/transformer.ts`,
      '^(waypoint|wp|test|spec)\\..*\\.(ts)$': `${testUtilsDir}/src/waypoint/transformer.ts`,
      ...defConf.transform,
    },
  }

}
