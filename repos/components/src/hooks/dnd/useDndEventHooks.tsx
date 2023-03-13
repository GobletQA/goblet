import type { TOnDrop } from './useDndHooks'
import type { MutableRefObject, KeyboardEventHandler } from 'react'

import { useCallback } from 'react'

export type THDndEventHooks = {
  data?:string
  index:number
  onDrop: TOnDrop
  onHideDiv: () => void
  onShowDiv: () => void
  onKeyDown?: KeyboardEventHandler<Element>
  dragHandleRef: MutableRefObject<HTMLElement>
  shiftTabPressedRef: MutableRefObject<boolean>
}

const onHandleKeyDown = (props:THDndEventHooks) => {
  const {
    index,
    data,
    onDrop,
    dragHandleRef
  } = props
  
  return useCallback(
    (keyE: React.KeyboardEvent) => {
      if (!dragHandleRef || document.activeElement !== dragHandleRef.current) return
      if (keyE.key !== 'ArrowDown' && keyE.key !== 'ArrowUp') return

      keyE.preventDefault()
      keyE.stopPropagation()

      if (keyE.key === 'ArrowUp') {
        if (index === 0) return
        onDrop(index, index - 1, data, data)
      }
      else if (keyE.key === 'ArrowDown')
        onDrop(index, index + 1, data, data)
    },
    [data, dragHandleRef, index, onDrop]
  )
}

const onHandleFocus = (props:THDndEventHooks) => {
  const {
    onShowDiv,
    dragHandleRef,
    shiftTabPressedRef,
  } = props

  return useCallback(
    (e: React.FocusEvent) => {
      if (!dragHandleRef) return

      onShowDiv()

      !shiftTabPressedRef.current
        && dragHandleRef.current
        && dragHandleRef.current.focus()
    },
    [
      onShowDiv,
      dragHandleRef,
      shiftTabPressedRef,
    ]
  )
}

export const useDndEventHooks = (props:THDndEventHooks) => {

  const {
    onHideDiv,
    onKeyDown,
    shiftTabPressedRef
  } = props

  const onContainerKeyDown = useCallback((keyE: React.KeyboardEvent) => {
    if (keyE.key === 'Enter')
      return onKeyDown?.(keyE)

    if (keyE.shiftKey && keyE.key === 'Tab') {
      shiftTabPressedRef.current = true
      onHideDiv()
    }
  }, [])

  const onDragHandleFocus = onHandleFocus(props)
  const onDragHandleKeyDown = onHandleKeyDown(props)

  return {
    onDragHandleFocus,
    onContainerKeyDown,
    onDragHandleKeyDown,
  }
}