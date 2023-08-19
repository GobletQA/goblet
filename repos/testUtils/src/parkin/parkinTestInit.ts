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


export const getParkinOptions = () => {
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
    timeout: options?.timeout ?? 15000,
    ...(GOBLET_FEATURE_NAME && { name: GOBLET_FEATURE_NAME }),
    tags: GOBLET_FEATURE_TAGS ? { filter: GOBLET_FEATURE_TAGS.split(/\s|,/) } : {}
  }
}

/**
 * Gets the options to be passed on to parkin
 * Currently set using envs, but would be better to define a config object
 * TODO: investigate loading in the goblet.config in this content
 * Have access to the global object, so could use that for loading Parkin config options
 */
global.getParkinOptions = getParkinOptions
