import { setItems } from 'GBActions'
import { Values } from 'GBConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { definitionsByType } from 'GBUtils/shared'

const { CATEGORIES } = Values

/**
 * Dispatches the passed in step definitions to the Store
 * @type function
 * @param {Object} definitions - Parsed definitions matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const setDefinitions = (definitions = noOpObj, definitionTypes) => {
  setItems(CATEGORIES.DEFINITIONS, definitions)
  setItems(
    CATEGORIES.DEFINITION_TYPES,
    definitionTypes || definitionsByType(definitions)
  )
}
