import type { TDndItemData, TRaceGran, TRaceAst, TRaceParentAst } from '@GBR/types'

import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'

export type THDndData = {
  index:number
  item:TRaceAst
  gran:TRaceGran
  parent:TRaceParentAst
  parentType: ESectionType
}

export const useDndData = (props:THDndData) => {
  const {
    item,
    gran,
    index,
    parent,
    parentType,
  } = props
  
  return useMemo(() => {
    return JSON.stringify({
      index,
      gran: gran.uuid,
      item: item.uuid,
      granType: gran.type,
      parent: parent.uuid,
      parentType: parentType,
    } as TDndItemData)
  }, [
    item,
    index,
    parent,
    parentType
  ])
}
