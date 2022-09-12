import { upsertItems } from 'GBActions'
import { noOpObj } from '@keg-hub/jsutils'
import { Values, ActionTypes } from 'GBConstants'

const { CATEGORIES } = Values

/**
 * Dispatches the passed in features to the Store
 * @type {function}
 * @param {Object} features - Parsed features matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const upsertFeatures = (features = noOpObj) => {
  upsertItems(CATEGORIES.FEATURES, features)
}
