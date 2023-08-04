import { TTask, TTaskActionArgs } from '../../types'

import { ETestType } from '../../types'
import { sharedOptions, Logger } from '@keg-hub/cli-utils'
import { runTestCmd } from '@GTasks/utils/helpers/runTestCmd'
import { buildBddEnvs } from '@GTasks/utils/envs/buildBddEnvs'
import { buildTestArgs } from '@GTasks/utils/test/buildTestArgs'
import { getTestConfig } from '@GTasks/utils/test/getTestConfig'
import { filterTaskEnvs } from '@GTasks/utils/envs/filterTaskEnvs'


/**
 * Run parkin tests in container
 */
const runBdd = async (args:TTaskActionArgs) => {
  const { params, goblet, task } = args

  process.env.GOBLET_TEST_DEBUG &&
    Logger.stdout(`runBdd Task Params:\n${JSON.stringify(params, null, 2)}\n`)

  filterTaskEnvs(params, task)
  const testConfig = await getTestConfig(params, ETestType.feature)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    goblet,
    type: ETestType.bdd,
    cmdArgs: buildTestArgs(params, testConfig),
    envsHelper: (browser, reportPath) => buildBddEnvs(browser, params, reportPath, ETestType.feature)
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
