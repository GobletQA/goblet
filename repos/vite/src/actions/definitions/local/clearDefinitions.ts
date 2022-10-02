import { defsDispatch } from '@store'

/**
 * Dispatches an update to clear out all definitions by resetting the state to an empty object
 */
export const clearDefinitions = () => {
  defsDispatch.clearDefs()
  defsDispatch.clearDefTypes()

}
