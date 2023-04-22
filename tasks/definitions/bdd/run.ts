import { TTask, TTaskActionArgs } from '../../types'

import constants from '../../constants'
import { sharedOptions, Logger } from '@keg-hub/cli-utils'
import { runTestCmd } from '@GTasks/utils/helpers/runTestCmd'
import { buildBddEnvs } from '@GTasks/utils/envs/buildBddEnvs'
import { buildJestArgs } from '@GTasks/utils/jest/buildJestArgs'
import { getJestConfig } from '@GTasks/utils/jest/getJestConfig'
import { filterTaskEnvs } from '@GTasks/utils/envs/filterTaskEnvs'

const { testTypes } = constants

/**
 * Run parkin tests in container
 */
const runBdd = async (args:TTaskActionArgs) => {
  const { params, goblet, task } = args

  process.env.GOBLET_TEST_DEBUG &&
    Logger.stdout(`runBdd Task Params:\n${JSON.stringify(params, null, 2)}\n`)

  filterTaskEnvs(params, task)
  const jestConfig = await getJestConfig(params, testTypes.feature)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: testTypes.bdd,
    cmdArgs: buildJestArgs(params, jestConfig),
    envsHelper: (browser, reportPath) => buildBddEnvs(browser, params, reportPath, testTypes.feature)
  })

  process.exit(exitCode)
}

export const run:TTask = {
  name: `run`,
  action: runBdd,
  example: `pnpm dev bdd run`,
  description: `Runs bdd feature file tests for the mounted repo`,
  alias: [`test`],
  options: sharedOptions(
    `test`,
    {},
    [
      `context`,
      `browsers`,
      `allBrowsers`,
      `chromium`,
      `firefox`,
      `webkit`,
      `headless`,
      `tags`,
      `filter`,
      `concurrent`,
      `log`,
      `noTests`,
      `slowMo`,
      `browserTimeout`,
      `debug`,
      `testCI`,
      `testBail`,
      `testSync`,
      `testDebug`,
      `testRetry`,
      `testCache`,
      `testReport`,
      `testReportName`,
      `testColors`,
      `testTimeout`,
      `testVerbose`,
      `testWorkers`,
      `testOpenHandles`,
      `parkinDebug`,
      `devtools`,
      `container`,
      `mode`,
      `repo`,
      `tracing`,
      `screenshot`,
      `base`,
      `device`,
      `width`,
      `height`,
      `appUrl`,
      `downloads`,
      `geolocation`,
      `hasTouch`,
      `isMobile`,
      `permissions`,
      `record`,
      `storageState`,
      `timezone`,
      `artifactsDebug`,
    ]
  ),
}
