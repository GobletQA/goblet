import type { THDndData } from '@GBR/hooks/editor/useDndData'

import { useRef } from 'react'
import { colors } from '@gobletqa/components'
import { DragImagePos } from '@GBR/constants/values'
import { useDndData } from '@GBR/hooks/editor/useDndData'

export type THDnd = THDndData & {}

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

  return {
    data,
    dragHandleSx,
    dragHandleRef,
    dragImagePos: DragImagePos,
  }

}