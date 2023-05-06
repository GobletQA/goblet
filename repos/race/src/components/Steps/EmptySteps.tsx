import type { CSSProperties } from 'react'
import type { TRaceStepParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { StepItem } from '../Feature/FeatureItems'
import { EmptyItem } from '../EmptyItem/EmptyItem'
const {iconContainerSx, sx, iconSx, ...stepMeta} = StepItem

export type TEmptySteps = {
  text?:string
  sx?:CSSProperties
  addSx?:CSSProperties
  parent:TRaceStepParent
  buttonSx?:CSSProperties
  parentType: ESectionType
  variant?:`text`|`outlined`
  containerSx?: CSSProperties
  onAdd?:(parentId:string) => void
}

export const EmptySteps = (props:TEmptySteps) => {
  const {
    sx,
    text,
    addSx,
    onAdd,
    parent,
    variant,
    buttonSx,
    parentType,
    containerSx,
  } = props

  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...stepMeta}
      sx={sx}
      text={text}
      addSx={addSx}
      variant={variant}
      buttonSx={buttonSx}
      onClick={onAddStep}
      parentId={parent.uuid}
      parentType={parentType}
      containerSx={containerSx}
      type={StepItem.type as ESectionType}
    />
  )
}