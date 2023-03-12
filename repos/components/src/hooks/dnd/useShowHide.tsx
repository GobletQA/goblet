import type { RefObject } from 'react'

import { useCallback } from 'react'
import { DndHoverCls } from '@GBC/constants/values'


export type THShowHide = {
  showHandle:boolean
  dragDivRef: RefObject<HTMLDivElement>
  dragButtonRef: RefObject<HTMLDivElement>
}

export const useShowHide = (props:THShowHide) => {

  const {
    showHandle,
    dragDivRef,
    dragButtonRef,
  } = props

  const onShowDiv = useCallback(() => {
    if (!dragDivRef.current) return

    dragDivRef.current.classList.add(DndHoverCls)
    
    dragButtonRef.current
      && (dragButtonRef.current.style.display = 'inherit')

  }, [dragDivRef, dragButtonRef])

  const onHideDiv = useCallback(() => {
    if (!dragDivRef.current) return

    dragDivRef.current.classList.remove(DndHoverCls)
    
    !showHandle
      && dragButtonRef.current
      && (dragButtonRef.current.style.display = 'none')
  }, [dragDivRef, dragButtonRef, showHandle])

  return {
    onHideDiv,
    onShowDiv,
  }

}