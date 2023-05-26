import { TFileModel, TSetting } from '@types'

import {
  exists,
  isNum,
  toNum,
  isBool,
  toBool,
  emptyObj,
  emptyArr,
  checkCall,
  deepMerge,
  flatUnion,
} from '@keg-hub/jsutils'
import { getStore } from '@store'

export type TBuiltCmdParams = {
  file:TFileModel
}

/**
 
 * This is used to fix a bug, really the type should already be correct
 * Need to investigate why it's not set
 */
const ensureType = (setting:TSetting) => {
  if(!setting || !setting.active || !exists(setting.value)) return undefined
  if(!setting?.type) return setting?.value
  
  return setting.type === `number` && setting?.postfix !== `px`
    ? isNum(setting.value)
      ? setting.value
      : toNum(setting.value)
    : setting.type === `boolean` && !isBool(setting.value)
      ? toBool(setting.value)
      : setting.value
}

const conditionalAddParam = (key:string, value?:string|number) => {
  return exists(value) ? (key ? `${key}=${value}` : `--${value}`) : ''
}

const conditionalAddOpt = (key:string, value?:string|number) => {
  return exists(value) ? ({[key]: value}) : emptyObj
}

const conditionalAddSettingOpt = (
  key:string,
  setting:TSetting
) => {
  const value = setting?.active ? ensureType(setting) : undefined
  
  return exists(value)
    ? ({[key]: value})
    : emptyObj
}

const conditionalAddSettingParam = (
  key:string,
  setting:TSetting
) => {
  const value = setting?.active ? ensureType(setting) : undefined

  return exists(value)
    ? key
      ? `${key}=${value}`
      : `--${value}`
    : ''
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
      ...conditionalAddSettingOpt(`debug`, mergedSettings?.browser?.debug),
      ...conditionalAddSettingOpt(`slowMo`, mergedSettings?.browser?.slowMo),
      ...conditionalAddSettingOpt(`testTimeout`, mergedSettings?.browser?.timeout),
    },
    params: [
      conditionalAddSettingParam(`debug`, mergedSettings?.browser?.debug),
      conditionalAddSettingParam(`slowMo`, mergedSettings?.browser?.slowMo),
      conditionalAddSettingParam(`testTimeout`, mergedSettings?.browser?.timeout),
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
