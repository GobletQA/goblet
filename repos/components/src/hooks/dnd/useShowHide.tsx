import type { RefObject, MutableRefObject } from 'react'

import { useCallback } from 'react'
import { DndHoverCls } from '@GBC/constants/values'


export type THShowHide = {
  showHandle:boolean
  dragDivRef: RefObject<HTMLDivElement>
  dragHandleRef: MutableRefObject<HTMLElement>
}

export const useShowHide = (props:THShowHide) => {

  const {
    showHandle,
    dragDivRef,
    dragHandleRef,
  } = props

  const onShowDiv = useCallback(() => {
    if (!dragDivRef.current) return

    dragDivRef.current.classList.add(DndHoverCls)
    
    dragHandleRef.current
      && (dragHandleRef.current.style.display = 'inherit')

  }, [dragDivRef, dragHandleRef])

  const onHideDiv = useCallback(() => {
    if (!dragDivRef.current) return

    dragDivRef.current.classList.remove(DndHoverCls)
    
    !showHandle
      && dragHandleRef.current
      && (dragHandleRef.current.style.display = 'none')
  }, [dragDivRef, dragHandleRef, showHandle])

  return {
    onHideDiv,
    onShowDiv,
  }

}