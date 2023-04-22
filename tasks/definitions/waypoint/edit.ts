import type { TTask, TTaskActionArgs } from '../../types'

import { timedRun } from '@keg-hub/jsutils'
import { dockerCmd } from '@keg-hub/cli-utils'
import { launchBrowser } from '@GTasks/utils/playwright/launchBrowser'

/**
 * Runs the edit command, and logs out a warning if
 * the user forgot to include `playwright.create` in their
 * test file.
 * @param {string} containerName
 * @param {string} testName
 * @param {number} expectedMinTime
 * @return {*} result of dockerCmd
 */
const runEditCmd = async (containerName, testName, expectedMinTime = 10000) => {
  // TODO: Add playwright record edit method to allow editing previously recorded waypoint tests
  // Updates to use something like playwright.create()
  // const [ exitCode, duration ] = await timedRun(dockerCmd, containerName, `npx playwright edit ${testName}`)
  // if (exitCode === 0 && duration < expectedMinTime)
  //   console.log(
  //     '\x1b[35m%s\x1b[0m',
  //     'The edit process exited quickly! You may have forgotten to mark the edit location in your test file with `await playwright.create()`'
  //   )
  // return exitCode
}

const editTest = async (args:TTaskActionArgs) => {
  const { params } = args
  const { context, launch } = params

  // ensure a non-headless chromium instance is running
  // await launchBrowser({ type: 'chromium', headless: false, launch })

  // runEditCmd(params.container, context)
}

export const edit:TTask = {
  name: `edit`,
  action: editTest,
  example: `pnpm test:edit`,
  description: `Edit an existing test based on the passed in context`,
  options: {
    context: {
      alias: [`name`],
      description: `Context or name of the test to be edit`,
      required: true,
    },
    container: {
      description: `Name of container within which to run create command`,
      example: `--container goblet`,
      required: true,
      default: `goblet`,
    },
    launch: {
      description:
        `Launch a playwright websocket to allow remote connections to the browser.\nNot valid in headless mode.`,
      example: `start --launch`,
      default: false,
    },
  },
}
