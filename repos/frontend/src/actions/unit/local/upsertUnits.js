import { dispatch } from 'GBStore'
import { noPropArr } from '@keg-hub/jsutils'
import { Values, ActionTypes } from 'GBConstants'

const { CATEGORIES } = Values

/**
 * Dispatches the passed in unit to the Store
 * @type function
 * @param {Array} units - Parsed unit tests matching the filesModel
 *
 * @returns {void}
 */
export const upsertUnits = (units = noPropArr) => {
  // TODO
}
