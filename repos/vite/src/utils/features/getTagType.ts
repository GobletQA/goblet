import type { TAstType } from '@types'

import { EAstObject } from '@ltipton/parkin'

/**
 * Finds the parents type by checking for its corresponding AST type
 * @function
 *
 */
export const getTagType = (parent:TAstType) => {
  return parent && Object.keys(EAstObject).find(type => type in parent) || null
}
