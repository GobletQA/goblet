import type { MutableRefObject } from 'react'

import { colors } from '@GBC/theme'
import { useRef, useMemo } from 'react'

const dropIndicator = document.createElement('hr')
dropIndicator.style.marginTop = `10px`
dropIndicator.style.marginBottom = `10px`
dropIndicator.style.pointerEvents = `none`
dropIndicator.style.borderTop = `3px solid ${colors.purple10}`


export type THDndRefs = {
  dragHandleRef?:MutableRefObject<HTMLElement>
}

export const useDndRefs = (props:THDndRefs) => {
  const { dragHandleRef:dHandleRef } = props

  const localHandleRef = useRef<HTMLDivElement>(null)

  const dragHandleRef = useMemo(
    () => (dHandleRef || localHandleRef),
    [dHandleRef, localHandleRef]
  ) as MutableRefObject<HTMLElement>

  const shiftTabPressedRef = useRef(false)
  const dragDivRef = useRef<HTMLDivElement>(null)
  const dropIndicatorRef = useRef<HTMLHRElement>(dropIndicator)

  return {
    dragDivRef,
    dragHandleRef,
    dropIndicatorRef,
    shiftTabPressedRef,
  }
}

