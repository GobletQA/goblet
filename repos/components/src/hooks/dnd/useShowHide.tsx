import type { TDndMouseHover, TDndDragCallback } from '@GBC/types'
import type { RefObject, MutableRefObject, CSSProperties, MouseEvent } from 'react'

import { useRef, useCallback, useEffect } from 'react'
import { DndHoverCls } from '@GBC/constants/values'


export type THShowHide = TDndMouseHover & {
  showDragHandle:boolean
  dragHandleSx?:CSSProperties
  dragDivRef:RefObject<HTMLDivElement>
  dragHandleRef:MutableRefObject<HTMLElement>
}

export const useShowHide = (props:THShowHide) => {

  const {
    dragDivRef,
    dragHandleSx,
    dragHandleRef,
    showDragHandle,
    onMouseEnter,
    onMouseLeave,
  } = props

  const displayStyleRef = useRef<string>('inherit')

  const onShowDiv = useCallback<TDndDragCallback>((evt) => {
    if (!dragDivRef.current || showDragHandle === false) return

    dragDivRef.current.classList.add(DndHoverCls)

    dragHandleRef.current
      && (dragHandleRef.current.style.display = displayStyleRef.current)

    onMouseEnter?.(evt)
  }, [dragDivRef, dragHandleRef, showDragHandle])

  const onHideDiv = useCallback<TDndDragCallback>((evt) => {
    if (!dragDivRef.current || showDragHandle === false) return

    dragDivRef.current.classList.remove(DndHoverCls)
    
    !showDragHandle
      && dragHandleRef.current
      && (dragHandleRef.current.style.display = 'none')
    
    onMouseLeave?.(evt)
  }, [dragDivRef, dragHandleRef, showDragHandle])

  useEffect(() => {
    if(!dragDivRef.current) return

    else if(showDragHandle === false)
      dragHandleRef.current
        && (dragHandleRef.current.style.display = `none`)

    else if(dragHandleSx?.display) displayStyleRef.current = dragHandleSx.display

    else if(dragDivRef?.current?.style?.display)
      displayStyleRef.current = dragHandleRef.current.style.display

  }, [dragHandleSx, showDragHandle])

  return {
    onHideDiv,
    onShowDiv,
  }

}