import type { TRaceStepParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { StepItem } from '../Feature/FeatureItems'
import { EmptyItem } from '../EmptyItem/EmptyItem'


export type TEmptySteps = {
  parent:TRaceStepParent
  parentType: ESectionType
  onAdd?:(parentId:string) => void
}

export const EmptySteps = (props:TEmptySteps) => {
  const { onAdd, parent, parentType } = props
  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...StepItem}
      onClick={onAddStep}
      type={StepItem.type}
      parentId={parent.uuid}
      parentType={parentType}
    />
  )
}