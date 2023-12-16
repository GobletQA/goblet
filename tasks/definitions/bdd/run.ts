import type { TTask, TTaskActionArgs, TTaskParams } from '../../types'
import type { TBuildTestArgs, TBuildBddEnvs } from '@gobletqa/shared/types/testUtils.types'

import { appRoot } from '../../paths'
import { ETestType } from '../../types'
import { isArr } from '@keg-hub/jsutils/isArr'
import { sharedOptions, Logger } from '@keg-hub/cli-utils'
import { getDebugEnv } from '../../utils/envs/getDebugEnv'
import { runTestCmd } from '../../utils/helpers/runTestCmd'
import { getTestConfig } from '../../utils/test/getTestConfig'
import { filterTaskEnvs } from '../../utils/envs/filterTaskEnvs'
import { buildBddEnvs } from '@gobletqa/test-utils/utils/buildBddEnvs'
import { buildTestArgs } from '@gobletqa/test-utils/utils/buildTestArgs'

const logPair = (name:string, item:string) => {
  Logger.log(
    `  `,
    Logger.colors.gray(name),
    Logger.colors.cyan(item),
  )
}

const logInputParams = (params:TTaskParams) => {
  Logger.log(Logger.colors.magenta(`Task Params: `))
  const filtered = Object.entries(params)
    .map(([key, val]) => {
      const addVal = isArr(val)
        ? Boolean(val?.length)
        : Boolean(val)

      if(!addVal) return

      const print = isArr(val) ? val.join(`, `) : `${val}`
      logPair(`${key}:`, print)
    })

  Logger.empty()
}

/**
 * Run parkin tests in container
 */
const runBdd = async (args:TTaskActionArgs) => {
  const { params, task } = args

  ;(params.testVerbose || params.debug || process.env.GOBLET_TEST_DEBUG)
    && logInputParams(params)

  filterTaskEnvs(params, task)
  const testConfig = await getTestConfig(params, ETestType.feature)

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    cmdArgs: buildTestArgs(params as TBuildTestArgs, testConfig, ETestType.bdd),
    envsHelper: (browser) => {
      const debugVal = getDebugEnv(params)
      const props = {...params, cwd: appRoot} as TBuildBddEnvs
      if(debugVal) props.debugBrowser = debugVal

      return buildBddEnvs(props, browser, ETestType.feature, false,)
    }
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
      `suiteRetry`,
      `testCache`,
      `testReport`,
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
      `video`,
      `storageState`,
      `timezone`,
      `suiteTimeout`,
      `artifactsDebug`,
      `exitOnFailed`,
      `skipAfterFailed`,
    ]
  ),
}
