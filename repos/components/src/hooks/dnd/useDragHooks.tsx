import type { RefObject } from 'react'
import type { TOnDrop } from './useDndHooks'

import { useCallback } from 'react'
import { DndDraggingCls } from '@GBC/constants/values'

export type THDragHooks = {
  index: number
  onDrop: TOnDrop
  dragDivRef: RefObject<HTMLDivElement>
  dropIndicatorRef:RefObject<HTMLHRElement>
}

export const useDragHooks = (props:THDragHooks) => {

  const {
    index,
    onDrop,
    dragDivRef,
    dropIndicatorRef
  } = props

  const onDropBefore = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault()
      const fromIndex = Number(ev.dataTransfer.getData('text/plain'))
      onDrop(index, fromIndex)
    },
    [onDrop, index]
  )

  const onDropAfter = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault()
      const fromIndex = Number(ev.dataTransfer.getData('text/plain'))
      const newIndex = index >= fromIndex ? index : index + 1
      onDrop(newIndex, fromIndex)
    },
    [onDrop, index]
  )

  const onDragEnter = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
    dropIndicatorRef.current && 
      ev.currentTarget.appendChild(dropIndicatorRef.current)
  }, [])

  const onDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
  }, [])

  const onDragLeave = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
    dropIndicatorRef.current?.remove()
  }, [])

  const onDragStart = useCallback(
    (ev: React.DragEvent) => {
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
      ev.dataTransfer.setData('text/plain', index.toString())

      const dimensions = ev.currentTarget.getBoundingClientRect()
      ev.dataTransfer.setDragImage(ev.currentTarget, dimensions.width / 3, 0)

      dragDivRef.current?.classList.add(DndDraggingCls)
    },
    [index, dragDivRef]
  )

  const onDragEnd = useCallback(
    (ev: React.DragEvent) => {
      onDragLeave(ev)
      dragDivRef.current?.classList.remove(DndDraggingCls)
    },
    [dragDivRef]
  )

  return {
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDragEnter,
    onDropAfter,
    onDragStart,
    onDropBefore,
  }
}
