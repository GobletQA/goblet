import type { TStepParentAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EmptyItem } from '../General/EmptyItem'
import { StepItem } from '../Feature/FeatureItems'
import { useInline } from '@gobletqa/components'


export type TEmptySteps = {
  parent:TStepParentAst
  onAdd?:(parentId:string) => void
}

export const EmptySteps = (props:TEmptySteps) => {
  const { onAdd, parent } = props
  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...StepItem}
      onClick={onAddStep}
      type={StepItem.type}
      parentId={parent.uuid}
      parentType={ESectionType.background}
    />
  )
}