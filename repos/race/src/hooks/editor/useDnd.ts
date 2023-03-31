import type { THDndData } from '@GBR/hooks/editor/useDndData'

import { useRef } from 'react'
import { colors } from '@gobletqa/components'
import { DragImagePos } from '@GBR/constants/values'
import { useDndData } from '@GBR/hooks/editor/useDndData'

export type THDnd = THDndData & {
  
}

const dragHandleSx = {
  display: `flex`,
  color: colors.gray08,
  [`&:hover`]: {
    color: colors.purple10,
  }
}

export const useDnd = (props:THDnd) => {

  const data = useDndData(props)
  const dragHandleRef = useRef<HTMLDivElement|HTMLElement>()
  
  
  // TODO: update this to toggle to tooltip on and off
  // Probably need to switch to useState ?
  const dragTooltipOpenRef = useRef<boolean>(false)

  const onDragStart = () => {
    dragTooltipOpenRef.current = false
  }
  
  const onDragOver = () => {
    dragTooltipOpenRef.current = false
  }

  return {
    data,
    onDragOver,
    onDragStart,
    dragHandleSx,
    dragHandleRef,
    dragImagePos: DragImagePos,
    dragTooltipOpen: dragTooltipOpenRef.current,
  }

}