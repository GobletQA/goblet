import type { TRaceBackgroundParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
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
      type={BackgroundItem.type}
      parentId={parent.uuid}
      parentType={parentType}
    />
  )
}