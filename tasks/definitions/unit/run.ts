import { TTask, TTaskActionArgs } from '../../types'

import constants from '../../constants'
import { sharedOptions } from '@keg-hub/cli-utils'
import { runTestCmd } from '@GTasks/utils/helpers/runTestCmd'
import { buildJestArgs } from '@GTasks/utils/jest/buildJestArgs'
import { getJestConfig } from '@GTasks/utils/jest/getJestConfig'
import { filterTaskEnvs } from '@GTasks/utils/envs/filterTaskEnvs'
import { buildUnitEnvs } from '@GTasks/utils/envs/buildUnitEnvs'


const { testTypes } = constants

/**
 * Run unit tests in container
 * @param {Object} args
 */
const runUnit = async (args:TTaskActionArgs) => {
  const { params, goblet, task } = args

  filterTaskEnvs(params, task)
  const jestConfig = await getJestConfig(params, testTypes.unit)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.unit,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildUnitEnvs(
      browser,
      goblet,
      params,
      reportPath,
      testTypes.unit
    )
  })

  process.exit(exitCode)

}

export const run:TTask = {
  name: `run`,
  alias: [`test`],
  action: runUnit,
  example: `yarn dev unit run`,
  description: `Run unit tests for the mounted repo`,
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