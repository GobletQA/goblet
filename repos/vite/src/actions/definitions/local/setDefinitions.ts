import type { TDefinitionFileModelList } from '@types'

import { defsDispatch } from '@dispatchers'
import { noOpObj } from '@keg-hub/jsutils'
import { definitionsByType } from '@utils/definitions/definitionsByType'

/**
 * Dispatches the passed in step definitions to the Store
 * @type function
 * @param {Object} definitions - Parsed definitions matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const setDefinitions = (
  definitions:TDefinitionFileModelList = noOpObj as TDefinitionFileModelList,
) => {
  defsDispatch.setDefs(definitions)
  defsDispatch.setDefTypes(definitionsByType(Object.values(definitions)))
}
