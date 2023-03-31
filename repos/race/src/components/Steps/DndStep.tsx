import type {
  ComponentProps,
  MutableRefObject,
} from 'react'
import type { TDndCallbacks } from '@gobletqa/components'

import { Step } from './Step'
import { ESectionType } from '@GBR/types'
import { Dnd } from '@gobletqa/components'
import { useDnd } from '@GBR/hooks/editor/useDnd'

export type TDndStep = TDndCallbacks & ComponentProps<typeof Step> & {
  index:number
  showDragHandle:boolean
  parentType: ESectionType
}

export const DndStep = (props:TDndStep) => {
  const {
    index,
    step,
    gran,
    parent,
    onDrop,
    onClick,
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
    gran,
    index,
    parent,
    parentType,
    item: step,
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
      <Step
        {...rest}
        gran={gran}
        step={step}
        parent={parent}
        dragHandleSx={dragHandleSx}
        dragTooltipOpen={dragTooltipOpen}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

}
