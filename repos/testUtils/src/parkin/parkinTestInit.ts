/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Allows setting up parkin after Jest has been configured
 */

import { getParkinInstance } from './instance'

/**
 * Global helper to allow re-using the same parking instance for each test
 */
global.getParkinInstance = getParkinInstance


export const getParkinOptions = (opts?:{ timeout?:number, retry?:number }) => {
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
    run: {
      retry: options?.retry ?? 1,
      ...(opts?.timeout && { timeout: opts?.timeout }),
      ...(GOBLET_FEATURE_NAME && { name: GOBLET_FEATURE_NAME }),
      tags: GOBLET_FEATURE_TAGS ? { filter: GOBLET_FEATURE_TAGS.split(/\s|,/) } : {}
    }
  }
}

