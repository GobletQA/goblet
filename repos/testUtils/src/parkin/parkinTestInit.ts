/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Allows setting up parkin after Jest has been configured
 */

import { toInt, exists } from '@keg-hub/jsutils'
import { jasmineReporter } from '@GTU/Reports/jasmineReporter'
import { getParkinInstance } from '@gobletqa/shared/libs/parkin'

/**
 * Global helper to allow re-using the same parking instance for each test
 */
global.getParkinInstance = getParkinInstance

/**
 * Gets the options to be passed on to parkin
 * Currently set using envs, but would be better to define a config object
 * TODO: investigate loading in the goblet.config in this content
 * Have access to the global object, so could use that for loading Parkin config options
 */
global.getParkinOptions = () => {
  // Load the both goblet and parkin version
  // Goblet version overrides parkin version
  const {
    GOBLET_TEST_RETRY,
    GOBLET_TEST_TIMEOUT,
    PARKIN_FEATURE_NAME,
    PARKIN_FEATURE_TAGS,
    GOBLET_FEATURE_NAME = PARKIN_FEATURE_NAME,
    GOBLET_FEATURE_TAGS = PARKIN_FEATURE_TAGS,
  } = process.env

  return {
    ...(GOBLET_FEATURE_NAME && { name: GOBLET_FEATURE_NAME }),
    ...(GOBLET_TEST_TIMEOUT && { timeout: parseInt(GOBLET_TEST_TIMEOUT, 10) || 30000 }),
    ...(exists(GOBLET_TEST_RETRY) && { retry: parseInt(GOBLET_TEST_RETRY, 10) || 1 }),
    tags: GOBLET_FEATURE_TAGS ? { filter: GOBLET_FEATURE_TAGS } : {}
  }
}

const parkinTestInit = () => {
  const { GOBLET_TEST_RETRY } = process.env

  // This is set for all tests that are run
  // TODO: it on a per-step basis it would need to be added to Parkin in some capacity
  exists(GOBLET_TEST_RETRY) && jest.retryTimes(toInt(GOBLET_TEST_RETRY) || 1)

  // Add a custom jasmine reporter to track test status
  jasmineReporter()

  // Figure out where / how to best set this
  // jest.setTimeout(1000000000)
}

parkinTestInit()
