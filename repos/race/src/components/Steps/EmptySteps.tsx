import type { TStepParentAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EmptyItem } from '../Meta/EmptyItem'
import { StepItem } from '../Feature/FeatureItems'


export type TEmptySteps = {
  parent:TStepParentAst
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