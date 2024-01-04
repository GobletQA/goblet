import type {
  TTask,
  TTaskParams,
  TBuildBddEnvs,
  TBuildTestArgs,
  TTaskActionArgs,
} from '../../types'

import { appRoot } from '../../paths'
import { isArr } from '@keg-hub/jsutils/isArr'
import { ETestType } from '@gobletqa/shared/enums'
import { sharedOptions, Logger } from '@keg-hub/cli-utils'
import { runTestCmd } from '../../utils/helpers/runTestCmd'
import { getTestConfig } from '../../utils/test/getTestConfig'
import { filterTaskEnvs } from '../../utils/envs/filterTaskEnvs'
import { buildBddEnvs } from '@gobletqa/testify/utils/buildBddEnvs'
import { buildTestArgs } from '@gobletqa/testify/utils/buildTestArgs'
import { getBrowserDebugEnv } from '../../utils/envs/getBrowserDebugEnv'

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
      const debugVal = getBrowserDebugEnv(params)
      const props = {...params, cwd: appRoot} as TBuildBddEnvs
      if(debugVal) props.debugBrowser = debugVal
      else props.debugBrowser = undefined

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
      `debugBrowser`,
      `suiteTimeout`,
      `artifactsDebug`,
      `exitOnFailed`,
      `skipAfterFailed`,
      `reuseContext`,
      `reusePage`,
    ]
  ),
}
