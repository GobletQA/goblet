import { setItems } from 'GBActions'
import { Values } from 'GBConstants'
const { CATEGORIES } = Values

/**
 * Clears out all pass specs results from past test run
 */
export const clearSpecs = () => {
  setItems(CATEGORIES.SPEC_RESULTS, {})
}
