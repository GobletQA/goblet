import type { TRaceScenarioParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EmptyItem } from '../EmptyItem/EmptyItem'
import { PlaylistPlusIcon } from '@gobletqa/components'

export type TEmptyScenarios = {
  parentType:ESectionType
  parent:TRaceScenarioParent
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