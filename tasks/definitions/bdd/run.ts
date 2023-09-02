import { TTask, TTaskActionArgs, TTaskParams } from '../../types'

import { ETestType } from '../../types'


import { isArr } from '@keg-hub/jsutils/isArr'

import { sharedOptions, Logger } from '@keg-hub/cli-utils'
import { runTestCmd } from '@GTasks/utils/helpers/runTestCmd'
import { buildBddEnvs } from '@GTasks/utils/envs/buildBddEnvs'
import { buildTestArgs } from '@GTasks/utils/test/buildTestArgs'
import { getTestConfig } from '@GTasks/utils/test/getTestConfig'
import { filterTaskEnvs } from '@GTasks/utils/envs/filterTaskEnvs'
// import {runExam} from '@GTasks/utils/exam/runExam'

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

  // TODO: this will replace `runTestCmd` in the future
  // const exitCode = await runExam({
  //   params,
  //   goblet,
  //   config: testConfig,
  //   type: ETestType.bdd,
  // })

  // Run the test command for defined browsers
  const exitCode = await runTestCmd({
    params,
    cmdArgs: buildTestArgs(params, testConfig, ETestType.bdd),
    envsHelper: (browser) => buildBddEnvs(browser, params, ETestType.feature)
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
