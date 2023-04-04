import type { CSSProperties } from 'react'
import type { TRaceScenarioParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EmptyItem } from '../EmptyItem/EmptyItem'
import { PlaylistPlusIcon } from '@gobletqa/components'

export type TEmptyScenarios = {
  sx?:CSSProperties
  addSx?:CSSProperties
  buttonSx?:CSSProperties
  parentType:ESectionType
  containerSx?:CSSProperties
  parent:TRaceScenarioParent
  onAdd?:(parentId:string) => void
}

export const EmptyScenarios = (props:TEmptyScenarios) => {
  const {
    sx,
    addSx,
    onAdd,
    parent,
    buttonSx,
    parentType,
    containerSx,
  } = props

  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      sx={sx}
      addSx={addSx}
      buttonSx={buttonSx}
      onClick={onAddStep}
      text={`Add Scenario`}
      parentId={parent.uuid}
      parentType={parentType}
      Icon={PlaylistPlusIcon}
      featureKey={`scenarios`}
      containerSx={containerSx}
      type={ESectionType.scenario}
    />
  )
}