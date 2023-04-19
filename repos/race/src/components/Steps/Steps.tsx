import type { ReactNode } from 'react'
import type { TOnDrop } from '@gobletqa/components'
import type {
  TRaceGran,
  TRaceStep,
  TDndItemData,
  TRaceStepParent
} from '@GBR/types'

import { DndStep } from './DndStep'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { moveStep } from '@GBR/actions/general/moveStep'
import { useDropData } from '@GBR/hooks/editor/useDropData'
import { Dnd, EDndPos, useInline } from '@gobletqa/components'

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
  onMove?:(parentId:string, oldPos:number, newPos:number, pos:EDndPos) => void
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


  const data = useDropData(props)
  const onAddStep = useInline(() => onAdd?.(parent.uuid))
  const onDropStep = useInline<TOnDrop<TDndItemData>>((
    oldIdx,
    newIdx,
    pos:EDndPos,
    oldData,
    newData
  ) => {
    oldData?.parent && newData?.parent && oldData?.parent !== newData?.parent
      ? moveStep({
          pos,
          oldIdx,
          newIdx,
          newData,
          oldData,
        })
      : onMove?.(
          parent.uuid,
          oldIdx,
          newIdx,
          pos
        )
  })

  return (
    <Sections
      parent={parent}
      showAdd={showAdd}
      onAdd={onAddStep}
      type={ESectionType.step}
    >

      {parent?.steps?.length
        ? parent?.steps?.map((step, idx) => {
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
        : (
            <Dnd
              index={0}
              data={data}
              dropOnly={true}
              onDrop={onDropStep}
              parentTypes={[ESectionType.scenario, ESectionType.background]}
            />
          )
      }

      {children}
    </Sections>
  )
}