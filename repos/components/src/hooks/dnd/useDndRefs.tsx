import type { MutableRefObject } from 'react'
import type { TDndOptionalCallbacks } from '@GBC/types'

import { colors } from '@GBC/theme'
import { useInline } from '@GBC/hooks'
import { useRef, useMemo } from 'react'

const dropIndicator = document.createElement('hr')
dropIndicator.style.marginTop = `10px`
dropIndicator.style.marginBottom = `10px`
dropIndicator.style.pointerEvents = `none`
dropIndicator.style.borderTop = `3px solid ${colors.purple10}`


export type THDndRefs = TDndOptionalCallbacks & {
  dragHandleRef?:MutableRefObject<HTMLElement>
}

export const useDndRefs = (props:THDndRefs) => {
  const {
    dragHandleRef:dHandleRef
  } = props

  const localHandleRef = useRef<HTMLDivElement>(null)

  const dragHandleRef = useMemo(
    () => (dHandleRef || localHandleRef),
    [dHandleRef, localHandleRef]
  ) as MutableRefObject<HTMLElement>

  const shiftTabPressedRef = useRef(false)
  const dragDivRef = useRef<HTMLDivElement>(null)
  const dropIndicatorRef = useRef<HTMLHRElement>(dropIndicator)

  const onDragEnd = useInline(props.onDragEnd)
  const onDragOver = useInline(props.onDragOver)
  const onDragEnter = useInline(props.onDragEnter)
  const onDragStart = useInline(props.onDragStart)
  const onDragLeave = useInline(props.onDragLeave)
  const onMouseEnter = useInline(props.onMouseEnter)
  const onMouseLeave = useInline(props.onMouseLeave)

  return {
    onMouseEnter,
    onMouseLeave,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragStart,
    onDragLeave,
    dragDivRef,
    dragHandleRef,
    dropIndicatorRef,
    shiftTabPressedRef,
  }
}

