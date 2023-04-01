import type { CSSProperties } from 'react'
import type { TRaceStepParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { StepItem } from '../Feature/FeatureItems'
import { EmptyItem } from '../EmptyItem/EmptyItem'


export type TEmptySteps = {
  sx?:CSSProperties
  addSx?:CSSProperties
  parent:TRaceStepParent
  parentType: ESectionType
  containerSx?: CSSProperties
  onAdd?:(parentId:string) => void
}

export const EmptySteps = (props:TEmptySteps) => {
  const { sx, containerSx, addSx, onAdd, parent, parentType } = props
  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...StepItem}
      sx={sx}
      addSx={addSx}
      onClick={onAddStep}
      type={StepItem.type}
      parentId={parent.uuid}
      parentType={parentType}
      containerSx={containerSx}
    />
  )
}