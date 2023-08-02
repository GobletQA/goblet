import type { TEnvObject, TBrowserType } from '../../types'

import { ETestType } from '../../types'


/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} context - `run` task params.context value
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerCmd options object, with envs
 */
export const buildExamTestEnvs = (
  browser:TBrowserType,
  env:TEnvObject={},
  context:string,
  reportPath:string,
  type:ETestType
) => {
  if(!type || !reportPath || !context) return env


  return env
}

