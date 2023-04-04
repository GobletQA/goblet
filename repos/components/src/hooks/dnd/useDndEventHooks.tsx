import type { TOnDrop, TDndDragCallback } from '@GBC/types'
import type { MutableRefObject, KeyboardEventHandler, KeyboardEvent, MouseEvent } from 'react'

import { useCallback } from 'react'
import { parseJSON, emptyObj } from '@keg-hub/jsutils'

export type THDndEventHooks = {
  data?:string
  index:number
  exact?:boolean
  onDrop: TOnDrop
  parentTypes?:string[]
  onHideDiv: TDndDragCallback
  onShowDiv: TDndDragCallback
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
        const parsed = data ? parseJSON(data) : emptyObj
        onDrop(index, index - 1, parsed, parsed)
      }
      else if (keyE.key === 'ArrowDown'){
        const parsed = data ? parseJSON(data) : emptyObj
        onDrop(index, index + 1, parsed, parsed)
      }
    },
    [data, dragHandleRef, index, onDrop]
  )
}

const onHandleFocus = (props:THDndEventHooks) => {
  const {
    exact,
    onShowDiv,
    dragHandleRef,
    shiftTabPressedRef,
  } = props

  return useCallback(
    (evt: React.FocusEvent) => {
      if (!dragHandleRef || (exact && evt.target !== dragHandleRef?.current)) return

      onShowDiv(evt as any)

      !shiftTabPressedRef.current
        && dragHandleRef.current
        && dragHandleRef.current.focus()
    },
    [
      exact,
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

  const onContainerKeyDown = useCallback((keyE: KeyboardEvent) => {
    if (keyE.key === 'Enter')
      return onKeyDown?.(keyE)

    if (keyE.shiftKey && keyE.key === 'Tab') {
      shiftTabPressedRef.current = true
      onHideDiv(keyE as any)
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