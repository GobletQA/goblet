import type { MutableRefObject } from 'react'

import { ESectionType } from '@GBR/types'
import { DndDragHandleCls } from '@gobletqa/components'

import {
  SectionDragHandleIcon,
  SectionDragHandleContainer,
} from './Section.styled'

export type TSectionDragHandle = {
  type:ESectionType
  dragHandleRef?: MutableRefObject<HTMLDivElement>
}

export const SectionDragHandle = (props:TSectionDragHandle) => {
  const {
    type,
    dragHandleRef
  } = props

  return (
    <SectionDragHandleContainer
      tabIndex={0}
      role='button'
      ref={dragHandleRef}
      aria-label={`${type} section drag button`}
      className={`${DndDragHandleCls} ${type}-section-drag-handle section-drag-handle`}
    >
      <SectionDragHandleIcon
        className={`${type}-section-drag-icon section-drag-icon`}
      />
    </SectionDragHandleContainer>
  )
  
  
}