import type { MutableRefObject, CSSProperties } from 'react'

import { emptyArr } from '@keg-hub/jsutils'
import { ESectionExt, ESectionType } from '@GBR/types'
import { DndDragHandleCls } from '@gobletqa/components'


import {
  SectionDragHandleIcon,
  SectionDragHandleContainer,
} from './Section.styled'

export type TSectionDragHandle = {
  sx?:CSSProperties
  parentTypes?:string[]
  containerSx?:CSSProperties
  type:ESectionType|ESectionExt
  dragHandleRef?: MutableRefObject<HTMLDivElement>
}

export const SectionDragHandle = (props:TSectionDragHandle) => {
  const {
    sx,
    type,
    containerSx,
    dragHandleRef,
    parentTypes=emptyArr,
  } = props

  return (
    <SectionDragHandleContainer
      tabIndex={0}
      role='button'
      sx={containerSx}
      ref={dragHandleRef}
      data-parent-types={parentTypes.join(',')}
      aria-label={`${type} section drag button`}
      className={`${DndDragHandleCls} ${type}-section-drag-handle section-drag-handle`}
    >
      <SectionDragHandleIcon
        sx={sx}
        className={`${type}-section-drag-icon section-drag-icon`}
      />
    </SectionDragHandleContainer>
  )
  
  
}