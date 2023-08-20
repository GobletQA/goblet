import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'

/**
 * Builds a model with real values from the passed in overrides and Model objects
 * Only sets properties that exist in the existing Model
 *
 * @param {Object} overrides - Values to set to the model properties
 * @param {Object} Model - Defines the properties that exist on the model
 *
 * @returns {Object} - Built model
 */
export const buildModel = <T=any>(overrides:any, Model:any): T =>
  deepMerge(Model, pickKeys(overrides, Object.keys(Model)))
