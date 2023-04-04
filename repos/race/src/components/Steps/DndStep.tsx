import type { TDndItemData } from '@GBR/types'
import type { TDndCallbacks } from '@gobletqa/components'
import type { ComponentProps, MutableRefObject } from 'react'

import { Step } from './Step'
import { ESectionType } from '@GBR/types'
import { Dnd } from '@gobletqa/components'
import { useDnd } from '@GBR/hooks/editor/useDnd'

export type TDndStep = TDndCallbacks<TDndItemData> & ComponentProps<typeof Step> & {
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
    dragImagePos,
    dragHandleSx,
    dragHandleRef,
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
      dragHandleSx={dragHandleSx}
      dragImagePos={dragImagePos}
      showDragHandle={showDragHandle}
      parentTypes={[ESectionType.scenario, ESectionType.background]}
      dragHandleRef={dragHandleRef as MutableRefObject<HTMLElement>}
    >
      <Step
        {...rest}
        gran={gran}
        step={step}
        parent={parent}
        dragHandleSx={dragHandleSx}
        dragHandleRef={dragHandleRef as MutableRefObject<HTMLDivElement>}
      />
    </Dnd>
  )

}
