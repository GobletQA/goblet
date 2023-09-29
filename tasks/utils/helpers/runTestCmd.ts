import type { SpawnOptionsWithoutStdio } from 'child_process'
import type { TTaskParams } from '../../types'

import fs from 'fs'
import path from 'path'
import { EBrowserType } from '../../types'
import { noOp } from '@keg-hub/jsutils/noOp'
import { toBool } from '@keg-hub/jsutils/toBool'
import { Logger, runCmd } from '@keg-hub/cli-utils'
import { runCommands } from '@GTasks/utils/helpers/runCommands'
import { handleTestExit } from '@GTasks/utils/helpers/handleTestExit'
import { InternalPaths } from '@gobletqa/environment/constants'

/**
 * Clears out the temp folder that contains test artifacts
 */
export const clearTestMetaDirs = () => {
  Logger.log(`Clearing temp folder...`)
  const tempDir = path.join(InternalPaths.gobletRoot, `temp`)

  Object.entries(InternalPaths)
    .map(([name, loc]:[string, string]) => {
      if(!loc) return

      try {
        if(name === `testMetaFile`) return fs.unlinkSync(loc)

        name.endsWith(`TempDir`) &&
          loc.startsWith(tempDir) &&
          fs.rm(loc, { recursive: true }, noOp)
      }
      catch(err){
        Logger.log(`Error cleaning temp dir, skipping!`)
        Logger.log(err.message)
      }

    })
}


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

  // Clear out the temp folder that hold the temp artifacts
  // Should make this a task option at some point
  // For now only do it when developing locally
  toBool(process.env.LOCAL_DEV) && clearTestMetaDirs()

  // - TODO: --- FIX THIS -- For now just default to using chromium
  // const { getBrowsers } = require('@gobletqa/browser')
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
