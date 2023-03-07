import type { TBackgroundParentAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EmptyItem } from '../General/EmptyItem'
import { BackgroundItem } from '../Feature/FeatureItems'

export type TEmptyBackground = {
  parentType: ESectionType
  parent:TBackgroundParentAst
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