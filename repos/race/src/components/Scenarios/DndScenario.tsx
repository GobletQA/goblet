import type { TRaceFeature } from '@GBR/types'
import type { TDndCallbacks } from '@gobletqa/components'
import type { ComponentProps, MutableRefObject } from 'react'


import { Scenario } from './Scenario'
import { ESectionType } from '@GBR/types'
import { Dnd } from '@gobletqa/components'
import { useDnd } from '@GBR/hooks/editor/useDnd'

export type TDndScenario = TDndCallbacks & ComponentProps<typeof Scenario> & {
  index:number
  feature: TRaceFeature
  showDragHandle:boolean
  parentType: ESectionType
}

export const DndScenario = (props:TDndScenario) => {
  const {
    index,
    scenario,
    parent,
    onDrop,
    onClick,
    feature,
    onKeyDown,
    parentType,
    showDragHandle,
    ...rest
  } = props

  const {
    data,
    onDragOver,
    onDragStart,
    dragImagePos,
    dragHandleSx,
    dragHandleRef,
    dragTooltipOpen,
  } = useDnd({
    index,
    parent,
    parentType,
    gran: feature,
    item: scenario,
  })

  return (
    <Dnd
      exact
      data={data}
      index={index}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      dragHandleSx={dragHandleSx}
      dragImagePos={dragImagePos}
      showDragHandle={showDragHandle}
      dragHandleRef={dragHandleRef as MutableRefObject<HTMLElement>}
    >
      <Scenario
        {...rest}
        parent={parent}
        key={scenario.uuid}
        scenario={scenario}
        scenarioId={scenario.uuid}
        dragHandleSx={dragHandleSx}
        showDragHandle={showDragHandle}
        dragTooltipOpen={dragTooltipOpen}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

}