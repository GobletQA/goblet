import type { TOnDrop } from './useDndHooks'
import type { RefObject, MutableRefObject, KeyboardEventHandler } from 'react'

import { useCallback } from 'react'

export type THDndEventHooks = {
  index:number
  onDrop: TOnDrop
  onHideDiv: () => void
  onShowDiv: () => void
  dragButtonRef: RefObject<HTMLDivElement>
  onKeyDown?: KeyboardEventHandler<Element>
  shiftTabPressedRef: MutableRefObject<boolean>
}

export const useDndEventHooks = (props:THDndEventHooks) => {
  
  const {
    index,
    onDrop,
    onHideDiv,
    onShowDiv,
    onKeyDown,
    dragButtonRef,
    shiftTabPressedRef
  } = props

  const onButtonKeyDown = useCallback(
    (keyE: React.KeyboardEvent) => {
      if (!dragButtonRef || document.activeElement !== dragButtonRef.current) return
      if (keyE.key !== 'ArrowDown' && keyE.key !== 'ArrowUp') return

      keyE.preventDefault()
      keyE.stopPropagation()

      if (keyE.key === 'ArrowUp') {
        if (index === 0) return
        onDrop(index - 1, index)
      }
      else if (keyE.key === 'ArrowDown')
        onDrop(index + 1, index)
    },
    [dragButtonRef, index, onDrop]
  )

  const onContainerKeyDown = useCallback((keyE: React.KeyboardEvent) => {
    if (keyE.key === 'Enter')
      return onKeyDown?.(keyE)

    if (keyE.shiftKey && keyE.key === 'Tab') {
      shiftTabPressedRef.current = true
      onHideDiv()
    }

  }, [])

  const onButtonFocus = useCallback(
    (e: React.FocusEvent) => {
      if (!dragButtonRef) return

      onShowDiv()

      !shiftTabPressedRef.current
        && dragButtonRef.current
        && dragButtonRef.current.focus()
    },
    [
      onShowDiv,
      dragButtonRef,
      shiftTabPressedRef,
    ]
  )


  return {
    onButtonFocus,
    onButtonKeyDown,
    onContainerKeyDown
  }
}