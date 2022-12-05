import { TFileModel } from '@types'

import {
  exists,
  checkCall,
  deepMerge,
  noPropArr,
} from '@keg-hub/jsutils'
import { getStore } from '@store'

export type TBuiltCmdParams = {
  cmd:string
  file:TFileModel
}

const conditionalAdd = (key:string, value:string) => {
  return exists(value) ? (key ? `${key}=${value}` : `--value`) : ''
}

const defSettings = {
  browser: {
    slowMo: 100,
  },
}

/**
 * Loads the world and store settings and merges them together
 * Then sets test run specific options based on the merged settings
 */
const resolveFromSettings = (args:TBuiltCmdParams) => {
  const { repo, settings } = getStore()?.getState()

  // TODO: add stetting.browser values here
  // Should only add if they have been modified from the default state
  const mergedSettings = deepMerge(defSettings, repo?.world?.settings)

  return [
    conditionalAdd(`slowMo`, mergedSettings?.browser?.slowMo),
    conditionalAdd(`testTimeout`, mergedSettings?.tests?.timeout),
    // TODO: Add other customizable settings here
  ]
}

/**
 * Builds the default params that all test exec type use
 * @function
 */
const buildDefaultParams = (args:TBuiltCmdParams) => {
  const { file } = args
  const repo = getStore()?.getState().repo
  
  return [
    conditionalAdd(`context`, file?.location),
    conditionalAdd(`base`, repo?.paths?.repoRoot),
    // Add user run settings here via state.settings and world.settings
    ...resolveFromSettings(args),
  ]
}

/**
 * Builds the params for feature file commands
 * @function
 */
const buildFeatureParams = (args:TBuiltCmdParams) => {

  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Feature file specific params here
  ].filter(Boolean)
}

/**
 * Builds the params for waypoint commands
 * @function
 */
const buildWaypointParams = (args:TBuiltCmdParams) => {
  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Waypoint file specific params here
  ].filter(Boolean)
}

/**
 * Builds the params for unit commands
 * @function
 */
const buildUnitParams = (args:TBuiltCmdParams) => {
  return [
    // Build the default params for all text exec types
    ...buildDefaultParams(args),
    // Add Unit file specific params here
  ].filter(Boolean)
}

/**
 * Holds methods for each text execution type based on fileType
 * @type {Object}
 */
const parmBuildMap = {
  unit: buildUnitParams,
  feature: buildFeatureParams,
  waypoint: buildWaypointParams,
}

/**
 * Finds the param build method based on file type and calls it
 * @function
 */
export const buildCmdParams = (args:TBuiltCmdParams) => {
  const { file } = args

  const typeKey = file?.fileType as keyof typeof parmBuildMap

  return (checkCall(parmBuildMap[typeKey], args) || noPropArr) as string[]
}
