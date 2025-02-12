import type { TTask, TTaskActionArgs, TBuildTestArgs } from '../../types'


import constants from '../../constants'
import { ETestType } from '@gobletqa/shared/enums'
import { sharedOptions } from '@keg-hub/cli-utils'
import { runTestCmd } from '../../utils/helpers/runTestCmd'
import { getTestConfig } from '../../utils/test/getTestConfig'
import { filterTaskEnvs } from '../../utils/envs/filterTaskEnvs'
import { buildWaypointEnvs } from '../../utils/envs/buildWaypointEnvs'
import { buildTestArgs } from '@gobletqa/testify/utils/buildTestArgs'

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
    cmdArgs: buildTestArgs(params as TBuildTestArgs, testConfig, ETestType.waypoint),
    envsHelper: (browser) => buildWaypointEnvs(
      browser,
      goblet,
      params,
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
      `video`,
      `storageState`,
      `timezone`,
      `testCI`,
      `testDebug`,
      `testCache`,
      `testReport`,
      `testRetry`,
      `suiteRetry`,
      `testColors`,
      `testTimeout`,
      `testVerbose`,
      `testWorkers`,
      `testOpenHandles`,
      `suiteTimeout`,
      `artifactsDebug`,
      `exitOnFailed`,
      `skipAfterFailed`,
    ]
  ),
}
