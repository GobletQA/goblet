import type { TDefinitionsTypeMapAst, TDefinitionsAst, EStepKey } from '@types'
import { isArr } from '@keg-hub/jsutils'

/**
 * Searches the passed in definitions for one that matches the passed in id
 */
export const getDefinitionFromId = (
  definitions:TDefinitionsAst | TDefinitionsTypeMapAst,
  id:string,
  type:EStepKey
) => {
  
  const defs = isArr(definitions)
    ? definitions
    : type
      ? definitions[type]
      : null

  return !defs || !id ? null : defs.find(def => def.uuid === id)
}
