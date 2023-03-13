import type {
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  ComponentProps,
  MutableRefObject,
} from 'react'

import type { TStepAst } from '@ltipton/parkin'
import type { TStepParentAst } from '@GBR/types'
import type { TDndCallbacks } from '@gobletqa/components'

import { useRef, useMemo } from 'react'
import { Step } from './Step'
import { Sections } from '../Section'
import { isObj, parseJSON } from '@keg-hub/jsutils'
import { ESectionType } from '@GBR/types'
import { Dnd, useInline } from '@gobletqa/components'

export type TSteps = {
  steps?:TStepAst[]
  showAdd?:boolean
  children?:ReactNode
  parent:TStepParentAst
  parentType: ESectionType
  onAdd?:(parentId:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
  onRemove?:(stepId:string, parentId?:string) => void
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
  step:TStepAst
  parent:TStepParentAst
  parentType: ESectionType
}

type TDropData = {
  index:number
  step:string
  parent:string
  parentType: ESectionType
}

const useStepData = (props:THStepData) => {
  const {
    step,
    index,
    parent,
    parentType,
  } = props
  
  return useMemo(() => {
    return JSON.stringify({
      index,
      step: step.uuid,
      parent: parent.uuid,
      parentType: parentType,
    })
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
    step,
    index,
    parent,
    parentType
  })

  return (
    <Dnd
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
        step={step}
        parent={parent}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

}

export const Steps = (props:TSteps) => {

  const {
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
  const onDropStep = useInline((oldIdx: number, newIdx: number) => onMove?.(parent.uuid, oldIdx, newIdx))

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