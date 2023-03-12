import type { MutableRefObject } from 'react'
import { useRef, useMemo } from 'react'

const dropIndicator = document.createElement('hr')
dropIndicator.style.marginTop = `6px`
dropIndicator.style.pointerEvents = `none`


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

