import { useRef, useMemo } from 'react'


const useDropIndicator = () => {
  return useMemo(() => {
    const dropIndicator = document.createElement('hr')
    dropIndicator.style.marginTop = `6px`
    dropIndicator.style.pointerEvents = `none`

    return dropIndicator
  }, [true])
}

export const useDndRefs = () => {

  const shiftTabPressedRef = useRef(false)
  const dragDivRef = useRef<HTMLDivElement>(null)
  const dragButtonRef = useRef<HTMLDivElement>(null)
  const dropIndicator = useDropIndicator()
  
  return {
    dropIndicator,
    dragDivRef,
    dragButtonRef,
    shiftTabPressedRef
  }
}

