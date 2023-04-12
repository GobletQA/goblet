import type { MutableRefObject, CSSProperties } from 'react'

import { emptyArr } from '@keg-hub/jsutils'
import { ESectionExt, ESectionType } from '@GBR/types'
import { DndDragHandleCls } from '@gobletqa/components'
import { cls } from '@keg-hub/jsutils'

import {
  SectionDragHandleIcon,
  SectionDragHandleContainer,
} from './Section.styled'

export type TSectionDragHandle = {
  sx?:CSSProperties
  disabled?:boolean
  parentTypes?:string[]
  containerSx?:CSSProperties
  type:ESectionType|ESectionExt
  dragHandleRef?: MutableRefObject<HTMLDivElement>
}

export const SectionDragHandle = (props:TSectionDragHandle) => {
  const {
    sx,
    type,
    disabled,
    containerSx,
    dragHandleRef,
    parentTypes=emptyArr,
  } = props

  return (
    <SectionDragHandleContainer
      tabIndex={0}
      role='button'
      sx={containerSx}
      ref={disabled ? undefined : dragHandleRef}
      data-parent-types={parentTypes.join(',')}
      aria-label={`${type} section drag button`}
      className={cls(
        DndDragHandleCls,
        `section-drag-handle`,
        `${type}-section-drag-handle`,
        disabled && `gb-section-drag-disabled`
      )}
    >
      <SectionDragHandleIcon
        sx={sx}
        className={cls(
          `section-drag-icon`,
          `${type}-section-drag-icon`,
          disabled && `gb-section-drag-disabled`
        )}
      />
    </SectionDragHandleContainer>
  )
  
  
}