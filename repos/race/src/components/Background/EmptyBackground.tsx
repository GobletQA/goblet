import type { TRaceBackgroundParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EAstObject } from '@ltipton/parkin'
import { EmptyItem } from '../EmptyItem/EmptyItem'
import { BackgroundItem } from '../Feature/FeatureItems'

export type TEmptyBackground = {
  parentType: ESectionType
  parent:TRaceBackgroundParent
  onAdd: (parentId:string) => void
}

export const EmptyBackground = (props:TEmptyBackground) => {
  const {
    onAdd,
    parent,
    parentType
  } = props

  const onClick = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...BackgroundItem}
      onClick={onClick}
      parentId={parent.uuid}
      parentType={parentType}
      type={BackgroundItem.type as EAstObject}
    />
  )
}