import type { TScenarioParentAst } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { PlaylistPlusIcon } from '@gobletqa/components'
import { EmptyItem } from '../Meta/EmptyItem'

export type TEmptyScenarios = {
  parentType:ESectionType
  parent:TScenarioParentAst
  onAdd?:(parentId:string) => void
}

export const EmptyScenarios = (props:TEmptyScenarios) => {
  const { onAdd, parent, parentType } = props
  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      onClick={onAddStep}
      text={`Add Scenario`}
      parentId={parent.uuid}
      parentType={parentType}
      Icon={PlaylistPlusIcon}
      featureKey={`scenarios`}
      type={ESectionType.scenario}
    />
  )
}