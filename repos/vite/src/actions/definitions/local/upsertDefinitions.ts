import type { TDefinitionFileModelList } from '@types'

import { emptyObj } from '@keg-hub/jsutils'
import { defsDispatch } from '@dispatchers'
import { definitionsByType } from '@utils/definitions/definitionsByType'

/**
 * Dispatches the passed in step definitions to the Store
 * @type function
 * @param {Object} definitions - Parsed definitions matching the filesModel, keyed by their filesystem path
 *
 * @returns {void}
 */
export const upsertDefinitions = (
  definitions:TDefinitionFileModelList = emptyObj as TDefinitionFileModelList,
) => {

  defsDispatch.upsertDefs(definitions)
  defsDispatch.upsertDefTypes(definitionsByType(Object.values(definitions)))
}
