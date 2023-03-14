import type { TRaceFeature } from '@GBR/types'
import type { TParseParentAst, TAstType } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'

export const generateId = (parent:TRaceFeature|TParseParentAst, child:TAstType, type?:ESectionType) => {
  const parentId = (parent as TRaceFeature)?.path || parent.uuid
  const idType = type || 'section'
  return `${parentId}-${idType}-${child.uuid}-${child.index}`
}