import { upsertItems } from 'GBActions'
import { noOpObj } from '@keg-hub/jsutils'
import { Values } from 'GBConstants'
import { definitionsByType } from 'GBUtils/shared'

const { CATEGORIES } = Values

/**
 * Dispatches the passed in step definitions to the Store
 * @type function
 * @param {Object} definitions - Parsed definitions matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const upsertDefinitions = (definitions = noOpObj, definitionTypes) => {
  upsertItems(CATEGORIES.DEFINITIONS, definitions)
  upsertItems(
    CATEGORIES.DEFINITION_TYPES,
    definitionTypes || definitionsByType(definitions)
  )
}
