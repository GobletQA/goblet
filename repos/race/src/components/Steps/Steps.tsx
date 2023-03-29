import type {
  ReactNode,
  ComponentProps,
  MutableRefObject,
} from 'react'
import type { TDndCallbacks } from '@gobletqa/components'
import type { TStepDndData, TRaceGran, TRaceStep, TRaceStepParent } from '@GBR/types'

import { useRef, useMemo } from 'react'
import { Step } from './Step'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { moveStep } from '@GBR/actions/general/moveStep'
import { EDndPos, Dnd, useInline } from '@gobletqa/components'

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

export type TDndStep = TDndCallbacks & ComponentProps<typeof Step> & {
  index:number
  showHandle:boolean
  parentType: ESectionType
}

const dragImagePos:[number, number] = [10, -20]

type THStepData = {
  index:number
  gran:TRaceGran
  step:TRaceStep
  parent:TRaceStepParent
  parentType: ESectionType
}

const useStepData = (props:THStepData) => {
  const {
    step,
    gran,
    index,
    parent,
    parentType,
  } = props
  
  return useMemo(() => {
    return JSON.stringify({
      index,
      gran: gran.uuid,
      step: step.uuid,
      granType: gran.type,
      parent: parent.uuid,
      parentType: parentType,
    } as TStepDndData)
  }, [
    step,
    index,
    parent,
    parentType
  ])
}

const DndStep = (props:TDndStep) => {
  const {
    index,
    step,
    gran,
    parent,
    onDrop,
    onClick,
    onKeyDown,
    parentType,
    showHandle,
    ...rest
  } = props

  const dragHandleRef = useRef<HTMLDivElement|HTMLElement>()

  const data = useStepData({
    gran,
    step,
    index,
    parent,
    parentType
  })

  return (
    <Dnd
      exact
      data={data}
      index={index}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={onKeyDown}
      showHandle={showHandle}
      dragImagePos={dragImagePos}
      dragHandleRef={dragHandleRef as MutableRefObject<HTMLElement>}
    >
      <Step
        {...rest}
        gran={gran}
        step={step}
        parent={parent}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

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
    oldData:TStepDndData,
    data:TStepDndData
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
              showHandle={true}
              onRemove={onRemove}
              onChange={onChange}
              onDrop={onDropStep}
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