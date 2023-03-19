import type { MutableRefObject, CSSProperties } from 'react'

import { ESectionExt, ESectionType } from '@GBR/types'
import { Tooltip, DndDragHandleCls } from '@gobletqa/components'

import {
  SectionDragHandleIcon,
  SectionDragHandleContainer,
} from './Section.styled'

export type TSectionDragHandle = {
  sx?:CSSProperties
  containerSx?:CSSProperties
  type:ESectionType|ESectionExt
  dragHandleRef?: MutableRefObject<HTMLDivElement>
}

export const SectionDragHandle = (props:TSectionDragHandle) => {
  const {
    sx,
    type,
    containerSx,
    dragHandleRef
  } = props

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Click and drag to rearrange the step position`}
    >
      <SectionDragHandleContainer
        tabIndex={0}
        role='button'
        sx={containerSx}
        ref={dragHandleRef}
        aria-label={`${type} section drag button`}
        className={`${DndDragHandleCls} ${type}-section-drag-handle section-drag-handle`}
      >
        <SectionDragHandleIcon
          sx={sx}
          className={`${type}-section-drag-icon section-drag-icon`}
        />
      </SectionDragHandleContainer>
    </Tooltip>
  )
  
  
}