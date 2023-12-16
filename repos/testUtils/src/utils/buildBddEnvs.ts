import type { TBuildBddEnvs } from '@GTU/Types'
import type { SpawnOptionsWithoutStdio } from 'child_process'

import { buildPWEnvs } from './buildPWEnvs'
import { addEnv } from '@gobletqa/shared/utils'
import { getBrowserType } from '@gobletqa/browser'
import { EBrowserType, ETestType, EBrowserName } from '@gobletqa/shared/enums'

/**
 * Builds the envs set in the command that runs a test
 * @param {String} browser - playwright browser name
 * @param {Object} params - `run` task params
 * @param {Object} reportPath - Path where the test report should be saved
 * @param {string} [type=feature] - Type of tests being run
 *
 * @return {Object} dockerCmd options object, with envs
 */
export const buildBddEnvs = (
  params:TBuildBddEnvs,
  browser:EBrowserType|EBrowserName=params?.browser,
  type:ETestType=params?.type || ETestType.feature,
  fromUi?:boolean
) => {
  const browserType = getBrowserType(browser)

  // Add the default playwright envs
  const env = buildPWEnvs({...params, browser: browserType}, {}, fromUi)

  if(fromUi) addEnv(env, `GOBLET_TOKEN`, params?.gobletToken)

  // Add feature file specific envs
  addEnv(env, `GOBLET_CONFIG_BASE`, params.base)
  addEnv(env, `GOBLET_FEATURE_TAGS`, params.tags)
  addEnv(env, `GOBLET_FEATURE_NAME`, params.filter)
  addEnv(env, `GOBLET_TEST_TYPE`, type === `feature` ? `bdd` : type)

  return { env, cwd: params?.cwd } as Partial<SpawnOptionsWithoutStdio>
}
