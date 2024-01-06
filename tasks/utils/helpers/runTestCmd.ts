import type { SpawnOptionsWithoutStdio } from 'child_process'
import type { TTaskParams, TGetBrowsers } from '../../types'

import { runCmd } from '@keg-hub/cli-utils'
import { getBrowsers } from '@gobletqa/browser'
import { runCommands } from '../helpers/runCommands'
import { EBrowserType } from '@gobletqa/shared/enums'
import { handleTestExit } from '../helpers/handleTestExit'

export type TRunTestCmd = {
  cmdArgs: string[]
  params:TTaskParams
  envsHelper: (browser:EBrowserType) => Partial<SpawnOptionsWithoutStdio>
}

export type TBrowserCmd = {
  cmdArgs:string[]
  cmdOpts: Partial<SpawnOptionsWithoutStdio>
}

export type TResp = Record<`exitCode`, any>


/**
 * Builds a browser exec method inside docker via Test
 * Runs in a child process and adds listeners for it's output
 * Allows capturing the output and formatting it as needed
 * @param {Array|string} cmdArgs - Arguments to pass to the test runner
 * @param {Object} cmdOpts - Extra Options for the child_process
 * @param {Object} params - Options arguments parsed into an object
 * @param {string} type - Type of tests being run
 * @param {string} browser - Name of the browser to run the tests for
 *
 * @returns {Number} - Sum of all exit codes from the executed test commands
 */
const buildBrowserCmd = (args:TBrowserCmd) => {
  const {
    cmdOpts,
    cmdArgs,
  } = args
  
  return async () => {
    return await new Promise<TResp>(async (res) => {
      const cmd = cmdArgs.shift()
      const exitCode = await runCmd(
        cmd,
        cmdArgs,
        cmdOpts as SpawnOptionsWithoutStdio
      )

      res(exitCode)
    })
  }
}

/**
 * Helper to run the command to execute tests
 * @param {Object} params - Options arguments parsed into an object
 * @param {Array|string} cmdArgs - Arguments to pass to the test runner
 * @param {string} reportPath - Path to where the test report should be saved
 * @param {function} envsHelper - Helper method to generate the correct envs for the test run
 *
 * @returns {Number} - Sum of all exit codes from the executed test commands
 */
export const runTestCmd = async (args:TRunTestCmd) => {
  const {
    params,
    cmdArgs,
    envsHelper,
  } = args

  // - TODO: --- FIX THIS -- For now just default to using chromium
  // Playwright fails to create the browser, because the incorrect permissions are passed
  // Because webkit and firefox can not take the same permissions as chrome
  // For some reason, chrome permissions are always used
  // const browsers = getBrowsers(params as unknown as TGetBrowsers)
  const browsers = [EBrowserType.chromium]

  const commands = browsers.map((browser) => {
    return buildBrowserCmd({
      cmdArgs: [...cmdArgs],
      cmdOpts: envsHelper(browser),
    })
  })

  // Run each of the test command and capture the exit-codes
  const codes = await runCommands(commands, params)

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes, [])
}
