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

import { useRef } from 'react'
import { Step } from './Step'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { Dnd, useInline } from '@gobletqa/components'

export type TSteps = {
  steps?:TStepAst[]
  showAdd?:boolean
  children?:ReactNode
  parent:TStepParentAst
  onAdd?:(parentId:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
  onRemove?:(stepId:string, parentId?:string) => void
} 

export type TDndStep = TDndCallbacks & ComponentProps<typeof Step> & {
  index:number
  showHandle:boolean
}

const DndStep = (props:TDndStep) => {
  const {
    index,
    onDrop,
    onClick,
    onKeyDown,
    showHandle,
    ...rest
  } = props

  const dragHandleRef = useRef<HTMLDivElement|HTMLElement>()

  return (
    <Dnd
      index={index}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={onKeyDown}
      showHandle={showHandle}
      dragHandleRef={dragHandleRef as MutableRefObject<HTMLElement>}
    >
      <Step
        {...rest}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

}

export const Steps = (props:TSteps) => {

  const {
    onAdd,
    parent,
    onRemove,
    onChange,
    children,
    showAdd=true,
  } = props
  const onAddStep = useInline(() => onAdd?.(parent.uuid))

  const onClickStep = (evt:MouseEvent) => {
    console.log(`------- on click step -------`)
  }
  
  const onDropStep = (droppedIndex: number, index: number) => {
    console.log(`------- on drop step -------`)
  }
  
  const onKeyDownStep = (evt:KeyboardEvent) => {
    console.log(`------- key down step -------`)
  }

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
              showHandle={true}
              parent={parent}
              onRemove={onRemove}
              onChange={onChange}
              onDrop={onDropStep}
              onClick={onClickStep}
              onKeyDown={onKeyDownStep}
              key={`${parent.uuid}-step-${step.index || idx}-${step.uuid}`}
            />
          )
        })
      }
      {children}
    </Sections>
  )
}