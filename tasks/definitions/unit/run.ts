import type { TTask, TTaskActionArgs } from '../../types'
import type { TBuildTestArgs } from '@gobletqa/shared/types'

import { ETestType } from '../../types'
import constants from '../../constants'
import { sharedOptions } from '@keg-hub/cli-utils'
import { runTestCmd } from '../../utils/helpers/runTestCmd'
import { getTestConfig } from '../../utils/test/getTestConfig'
import { filterTaskEnvs } from '../../utils/envs/filterTaskEnvs'
import { buildUnitEnvs } from '../../utils/envs/buildUnitEnvs'
import { buildTestArgs } from '@gobletqa/test-utils/utils/buildTestArgs'


const { testTypes } = constants

/**
 * Run unit tests in container
 * @param {Object} args
 */
const runUnit = async (args:TTaskActionArgs) => {
  const { params, goblet, task } = args

  filterTaskEnvs(params, task)
  const testConfig = await getTestConfig(params, testTypes.unit)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    cmdArgs: buildTestArgs(params as TBuildTestArgs, testConfig, ETestType.unit),
    envsHelper: (browser) => buildUnitEnvs(
      browser,
      goblet,
      params,
      testTypes.unit
    )
  })

  process.exit(exitCode)

}

export const run:TTask = {
  name: `run`,
  alias: [`test`],
  action: runUnit,
  example: `pnpm dev unit run`,
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
      `suiteTimeout`,
      `testOpenHandles`,
      `artifactsDebug`,
      `exitOnFailed`,
      `skipAfterFailed`,
    ]
  ),
}
