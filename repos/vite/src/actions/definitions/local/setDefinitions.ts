import type { TDefinitionsAstList, TDefinitionsAstTypeMap } from '@types'

import { defsDispatch } from '@reducers'
import { noOpObj } from '@keg-hub/jsutils'
import { definitionsByType } from '@utils/shared'

/**
 * Dispatches the passed in step definitions to the Store
 * @type function
 * @param {Object} definitions - Parsed definitions matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const setDefinitions = (
  definitions:TDefinitionsAstList = noOpObj as TDefinitionsAstList,
  definitionTypes:TDefinitionsAstTypeMap
) => {
  defsDispatch.setDefs(definitions)
  defsDispatch.setDefTypes(definitionTypes || definitionsByType(definitions))
}
