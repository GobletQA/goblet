import type { CSSProperties } from 'react'
import type { TRaceBackgroundParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EAstObject } from '@ltipton/parkin'
import { EmptyItem } from '../EmptyItem/EmptyItem'
import { BackgroundItem } from '../Feature/FeatureItems'

export type TEmptyBackground = {
  sx?:CSSProperties
  addSx?:CSSProperties
  buttonSx?:CSSProperties
  parentType: ESectionType
  containerSx?:CSSProperties
  parent:TRaceBackgroundParent
  onAdd: (parentId:string) => void
}

export const EmptyBackground = (props:TEmptyBackground) => {
  const {
    sx,
    addSx,
    onAdd,
    parent,
    buttonSx,
    parentType,
    containerSx,
  } = props

  const onClick = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...BackgroundItem}
      sx={sx}
      addSx={addSx}
      onClick={onClick}
      buttonSx={buttonSx}
      parentId={parent.uuid}
      parentType={parentType}
      containerSx={containerSx}
      type={BackgroundItem.type as EAstObject}
    />
  )
}