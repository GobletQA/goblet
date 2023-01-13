import { TFileModel } from '@types'

import {
  exists,
  emptyObj,
  emptyArr,
  checkCall,
  deepMerge,
  flatUnion,
} from '@keg-hub/jsutils'
import { getStore } from '@store'

export type TBuiltCmdParams = {
  cmd:string
  file:TFileModel
}

const conditionalAddParam = (key:string, value:string|number) => {
  return exists(value) ? (key ? `${key}=${value}` : `--${value}`) : ''
}

const conditionalAddOpt = (key:string, value:string|number) => {
  return exists(value) ? ({[key]: value}) : emptyObj
}

/**
 * Loads the world and store settings and merges them together
 * Then sets test run specific options based on the merged settings
 */
const resolveFromSettings = (args:TBuiltCmdParams) => {
  const { repo, settings } = getStore()?.getState()

  const mergedSettings = deepMerge(settings, repo?.world?.settings)

  return {
    options: {
      ...conditionalAddOpt(`debug`, mergedSettings?.browser?.debug),
      ...conditionalAddOpt(`slowMo`, mergedSettings?.browser?.slowMo),
      ...conditionalAddOpt(`testTimeout`, mergedSettings?.browser?.timeout),
    },
    params: [
      conditionalAddParam(`debug`, mergedSettings?.browser?.debug),
      conditionalAddParam(`slowMo`, mergedSettings?.browser?.slowMo),
      conditionalAddParam(`testTimeout`, mergedSettings?.browser?.timeout),
    ]
  }
}

/**
 * Builds the default params that all test exec type use
 * @function
 */
const buildDefaultParams = (args:TBuiltCmdParams) => {
  const { file } = args
  const repo = getStore()?.getState().repo
  // Add user run settings here via state.settings and world.settings
  const { options, params } = resolveFromSettings(args)
  const location = file?.location
  const base = repo?.paths?.repoRoot

  return {
    options: {
      ...conditionalAddOpt(`context`, location),
      ...conditionalAddOpt(`base`, base),
      ...options,
    },
    params: flatUnion([
      conditionalAddParam(`context`, location),
      conditionalAddParam(`base`, base),
    ], params).filter(Boolean)
  }
}

/**
 * Builds the params for feature file commands
 * @function
 */
const buildFeatureParams = (args:TBuiltCmdParams) => {
  const { params, options } = buildDefaultParams(args)

  return {
    options,
    params: [
      ...params,
      // Add Feature file specific params here
    ].filter(Boolean)
  }
}

/**
 * Builds the params for waypoint commands
 * @function
 */
const buildWaypointParams = (args:TBuiltCmdParams) => {
  const { params, options } = buildDefaultParams(args)

  return {
    options,
    params: [
      ...params,
      // Add Waypoint file specific params here
    ].filter(Boolean)
  }
}

/**
 * Builds the params for unit commands
 * @function
 */
const buildUnitParams = (args:TBuiltCmdParams) => {
  const { params, options } = buildDefaultParams(args)

  return {
    options,
    params: [
      ...params,
      // Add Unit file specific params here
    ].filter(Boolean)
  }
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
  return checkCall(parmBuildMap[typeKey], args) || { params: emptyArr, options: emptyObj  }

}
