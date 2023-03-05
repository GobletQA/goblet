import type { TDefinitionsTypeMapAst, TDefinitionsAstArr } from '@types'
import type { EStepKey } from '@ltipton/parkin'
import { isArr } from '@keg-hub/jsutils'

/**
 * Searches the passed in definitions for one that matches the passed in id
 */
export const getDefinitionFromId = (
  definitions:TDefinitionsAstArr | TDefinitionsTypeMapAst,
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
