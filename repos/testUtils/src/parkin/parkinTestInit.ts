/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Allows setting up parkin after Jest has been configured
 */

import { isNum } from '@keg-hub/jsutils'
import { jasmineReporter } from '@GTU/Reports/jasmineReporter'
import { getParkinInstance } from '@gobletqa/shared/libs/parkin'

/**
 * Global helper to allow re-using the same parking instance for each test
 */
global.getParkinInstance = getParkinInstance


const getParkinOptions = () => {
  // Load the both goblet and parkin version
  // Goblet version overrides parkin version
  const {
    PARKIN_FEATURE_NAME,
    PARKIN_FEATURE_TAGS,
    GOBLET_FEATURE_NAME = PARKIN_FEATURE_NAME,
    GOBLET_FEATURE_TAGS = PARKIN_FEATURE_TAGS,
  } = process.env

  const options = (global?.__goblet?.options || {})

  return {
    retry: options?.retry ?? 1,
    timeout: options?.timeout ?? 30000,
    ...(GOBLET_FEATURE_NAME && { name: GOBLET_FEATURE_NAME }),
    tags: GOBLET_FEATURE_TAGS ? { filter: GOBLET_FEATURE_TAGS } : {}
  }
}

/**
 * Gets the options to be passed on to parkin
 * Currently set using envs, but would be better to define a config object
 * TODO: investigate loading in the goblet.config in this content
 * Have access to the global object, so could use that for loading Parkin config options
 */
global.getParkinOptions = getParkinOptions

const parkinTestInit = () => {
  const opts = getParkinOptions()

  // This is set for all tests that are run
  // TODO: it on a per-step basis it would need to be added to Parkin in some capacity
  isNum(opts.retry) && jest.retryTimes(opts.retry)

  // Add a custom jasmine reporter to track test status
  jasmineReporter()

  // Figure out where / how to best set this
  isNum(opts.retry) && jest.setTimeout(opts.timeout)
}

parkinTestInit()
