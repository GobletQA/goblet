import type { TEnvObject, TBrowserType } from '../../types'

import { ETestType } from '../../types'
import { addEnv } from '../envs/addEnv'
import { buildReportTitle } from '@gobletqa/test-utils/reports/buildReportTitle'

/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} context - `run` task params.context value
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerCmd options object, with envs
 */
export const buildJestTestEnvs = (
  browser:TBrowserType,
  env:TEnvObject={},
  context:string,
  reportPath:string,
  type:ETestType
) => {
  if(!type || !reportPath || !context) return env

  // Build the output path, and page title based on the passed in context
  // JEST_HTML_REPORTER_OUTPUT_PATH
  addEnv(env, 'GOBLET_HTML_REPORTER_OUTPUT_PATH', reportPath)
  addEnv(
    env,
    'GOBLET_HTML_REPORTER_PAGE_TITLE',
    Boolean(type && context),
    buildReportTitle(type, context, browser)
  )

  return env
}

