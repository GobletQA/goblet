import type { TTask, TTaskActionArgs } from '../../types'

import constants from '../../constants'
import { sharedOptions } from '@keg-hub/cli-utils'
import { runTestCmd } from '@GTasks/utils/helpers/runTestCmd'
import { buildTestArgs } from '@GTasks/utils/test/buildTestArgs'
import { getTestConfig } from '@GTasks/utils/test/getTestConfig'
import { filterTaskEnvs } from '@GTasks/utils/envs/filterTaskEnvs'
import { buildWaypointEnvs } from '@GTasks/utils/envs/buildWaypointEnvs'

const { testTypes } = constants

/**
 * Run task for waypoint scripts
 * node ./tasks/runTask.js waypoint run context=/goblet/repos/lancetipton/current/goblet/waypoint/first.waypoint.js
 */
const runWp = async (args:TTaskActionArgs) => {
  const { params, goblet, task } = args

  filterTaskEnvs(params, task)
  const testConfig = await getTestConfig(params, testTypes.waypoint)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.waypoint,
    cmdArgs: buildTestArgs(params, testConfig),
    envsHelper: (browser, reportPath) => buildWaypointEnvs(
      browser,
      goblet,
      params,
      reportPath,
      testTypes.waypoint
    )
  })

  process.exit(exitCode)
}

export const run:TTask = {
  name: `run`,
  action: runWp,
  example: `pnpm test:run`,
  description: `Runs all or defined QAWolf tests`,
  alias: [`test`],
  options: sharedOptions(
    `run`,
    {},
    [
      `context`,
      `browsers`,
      `allBrowsers`,
      `chromium`,
      `firefox`,
      `webkit`,
      `headless`,
      `slowMo`,
      `browserTimeout`,
      `debug`,
      `devtools`,
      `log`,
      `mode`,
      `base`,
      `repo`,
      `testSync`,
      `container`,
      `device`,
      `width`,
      `height`,
      `appUrl`,
      `downloads`,
      `geolocation`,
      `hasTouch`,
      `isMobile`,
      `permissions`,
      `tracing`,
      `record`,
      `storageState`,
      `timezone`,
      `testCI`,
      `testDebug`,
      `testCache`,
      `testReport`,
      `testReportName`,
      `testColors`,
      `testTimeout`,
      `testVerbose`,
      `testWorkers`,
      `testOpenHandles`,
      `artifactsDebug`,
    ]
  ),
}
