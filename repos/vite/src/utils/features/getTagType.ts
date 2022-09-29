import type { TAstType } from '@types'
import { EAstObjects } from '@types'


/**
 * Finds the parents type by checking for its corresponding AST type
 * @function
 *
 */
export const getTagType = (parent:TAstType) => {
  return parent && Object.keys(EAstObjects).find(type => type in parent) || null
}
