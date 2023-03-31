import type { ReactNode } from 'react'
import type { TDndItemData, TRaceGran, TRaceStep, TRaceStepParent } from '@GBR/types'

import { DndStep } from './DndStep'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { moveStep } from '@GBR/actions/general/moveStep'
import { EDndPos, useInline } from '@gobletqa/components'

export type TSteps = {
  steps?:TRaceStep[]
  showAdd?:boolean
  gran: TRaceGran
  children?:ReactNode
  parent:TRaceStepParent
  parentType: ESectionType
  onAdd?:(parentId:string) => void
  onRemove?:(stepId:string, parentId:string) => void
  onChange?:(updated:TRaceStep, parentId:string) => void
  onMove?:(parentId:string, oldPos:number, newPos:number) => void
}

export const Steps = (props:TSteps) => {

  const {
    gran,
    onAdd,
    parent,
    onMove,
    onRemove,
    onChange,
    children,
    parentType,
    showAdd=true,
  } = props

  const onAddStep = useInline(() => onAdd?.(parent.uuid))
  const onDropStep = useInline((
    oldIdx: number,
    newIdx: number,
    pos:EDndPos,
    oldData:TDndItemData,
    data:TDndItemData
  ) => {
    oldData?.parent && data?.parent && oldData?.parent !== data?.parent
      ? moveStep(oldData, data, pos)
      : onMove?.(parent.uuid, oldIdx, newIdx)
  })

  return (
    <Sections
      parent={parent}
      showAdd={showAdd}
      onAdd={onAddStep}
      type={ESectionType.step}
    >
      {
        parent?.steps?.map((step, idx) => {
          return (
            <DndStep
              index={idx}
              step={step}
              gran={gran}
              parent={parent}
              onRemove={onRemove}
              onChange={onChange}
              onDrop={onDropStep}
              showDragHandle={true}
              parentType={parentType}
              key={`${parent.uuid}-step-${step.index || idx}-${step.uuid}`}
            />
          )
        })
      }
      {children}
    </Sections>
  )
}