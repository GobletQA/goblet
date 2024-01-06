/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Allows setting up parkin after Jest has been configured
 */

import { getParkinInstance } from './instance'
import { ENVS } from '@gobletqa/environment'

/**
 * Global helper to allow re-using the same parking instance for each test
 */
global.getParkinInstance = getParkinInstance


export const getParkinOptions = () => {
  const name = ENVS.GOBLET_FEATURE_NAME
  const tags = ENVS.GOBLET_FEATURE_TAGS

  const runOpts = {} as any
  name && (runOpts.name = name)
  runOpts.tags = tags ? { filter: tags.split(/\s|,/) } : {}

  return { run: runOpts }
}

