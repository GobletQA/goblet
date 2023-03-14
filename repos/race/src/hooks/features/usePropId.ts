import type { TRaceFeature } from '@GBR/types'
import type { TParseParentAst, TAstType } from '@ltipton/parkin'

import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'
import { shortId } from '@gobletqa/components'

export const usePropId = (parent:TRaceFeature|TParseParentAst, child:TAstType, type?:ESectionType) => {
  const parentId = (parent as TRaceFeature)?.path || parent.uuid

  return useMemo(() => {
    const short = shortId()
    const idType = type || 'section'
    return `${parentId}-${idType}-${child.uuid}-${short}`
  }, [parentId, child.uuid, type])

}