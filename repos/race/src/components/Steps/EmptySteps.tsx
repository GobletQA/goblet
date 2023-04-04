import type { CSSProperties } from 'react'
import type { TRaceStepParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { StepItem } from '../Feature/FeatureItems'
import { EmptyItem } from '../EmptyItem/EmptyItem'

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
      {...StepItem}
      sx={sx}
      text={text}
      addSx={addSx}
      variant={variant}
      buttonSx={buttonSx}
      onClick={onAddStep}
      type={StepItem.type}
      parentId={parent.uuid}
      parentType={parentType}
      containerSx={containerSx}
    />
  )
}