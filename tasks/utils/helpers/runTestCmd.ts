import type {
  ETestType,
  TEnvObject,
  TTaskParams,
  EBrowserType,
  TGobletConfig,
  TGetBrowsers,
} from '../../types'


import path from 'path'
import { runCmd } from '@keg-hub/cli-utils'
import { noPropArr, toBool } from '@keg-hub/jsutils'
import { ARTIFACT_SAVE_OPTS } from '@gobletqa/shared/constants'
import { runCommands } from '@GTasks/utils/helpers/runCommands'
import { handleTestExit } from '@GTasks/utils/helpers/handleTestExit'
import { buildReportPath } from '@gobletqa/test-utils/reports/buildReportPath'
import { shouldSaveArtifact } from '@gobletqa/shared/utils/artifactSaveOption'
import { clearTestMetaDirs } from '@gobletqa/test-utils/utils/clearTestMetaDirs'
import { appendToLatest, commitTestMeta } from '@gobletqa/test-utils/testMeta/testMeta'
import { copyArtifactToRepo } from '@gobletqa/test-utils/playwright/generatedArtifacts'

export type TRunTestCmd = {
  type: ETestType
  cmdArgs: string[]
  params:TTaskParams
  goblet: TGobletConfig
  envsHelper: (browser:EBrowserType, reportPath:string) => { env: TEnvObject }
}

export type TBrowserCmd = {
  type:ETestType
  cmdArgs:string[]
  reportPath:string
  params:TTaskParams
  browser:EBrowserType
  goblet: TGobletConfig
  cmdOpts: { env: TEnvObject }
}

export type TResp = Record<`exitCode`, any>


/**
 * Builds a browser exec method inside docker via Jest
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
    type,
    params,
    goblet,
    cmdOpts,
    cmdArgs,
    browser,
    reportPath
  } = args
  
  return async () => {
    const resp = await new Promise<TResp>(async (res) => {
      const cmd = cmdArgs.shift()

      const exitCode = await runCmd(
        cmd,
        cmdArgs,
        cmdOpts
      )

      res({ exitCode })
    })

    const testStatus = resp.exitCode
      ? ARTIFACT_SAVE_OPTS.failed
      : ARTIFACT_SAVE_OPTS.passed

    await appendToLatest(`${type}.browsers.${browser}`, {
      name: browser,
      status: testStatus,
      exitCode: resp.exitCode,
    })

    // Only copy the reports if testReport option is set, otherwise just return
    const saveArtifact = shouldSaveArtifact(params.testReport, testStatus)
    if(!saveArtifact) return resp.exitCode

    // Copy the report after the tests have run, because it doesn't get created until the very end
    await copyArtifactToRepo(
      reportPath,
      undefined,
      path.join(goblet.internalPaths.reportsTempDir, `${browser}-html-report.html`)
    )

    // Update the testMeta with the path to the report file for the specific browser
    await appendToLatest(`${type}.reports.${browser}`, {
      browser: browser,
      path: reportPath,
      name: reportPath.split(`/`).pop(),
    })

    return resp.exitCode
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
    type,
    goblet,
    params,
    cmdArgs,
    envsHelper,
  } = args

  // Clear out the temp folder that hold the temp artifacts
  // Should make this a task option at some point
  // For now only do it when developing locally
  toBool(process.env.LOCAL_DEV) && clearTestMetaDirs()

  let reportPaths = []
  const { getBrowsers } = await import('@gobletqa/screencast/libs/playwright/helpers/getBrowsers')
  
  const browsers = getBrowsers(params as unknown as TGetBrowsers)

  const commands = browsers.map((browser) => {
      const reportPath = buildReportPath(
        type,
        params as Record<any, any>,
        goblet,
        browser
      )
      reportPaths.push(reportPath)

      return buildBrowserCmd({
        type,
        goblet,
        params,
        browser,
        reportPath,
        cmdArgs: [...cmdArgs],
        cmdOpts: envsHelper(browser, reportPath),
      })
    }
  )

  // Run each of the test command and capture the exit-codes
  const codes = await runCommands(commands, params)

  await commitTestMeta()

  // Calculate the exit codes so we know if all runs were successful
  return handleTestExit(codes, params.testReport ? reportPaths : noPropArr)
}
