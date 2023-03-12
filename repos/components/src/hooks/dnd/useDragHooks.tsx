import type { RefObject } from 'react'
import type { TOnDrop } from './useDndHooks'

import { useCallback } from 'react'
import { DndDraggingCls, DndHoverCls } from '@GBC/constants/values'

export type THDragHooks = {
  index: number
  onDrop: TOnDrop
  dropIndicator: HTMLHRElement
  dragDivRef: RefObject<HTMLDivElement>
}

export const useDragHooks = (props:THDragHooks) => {

  const {
    index,
    onDrop,
    dragDivRef,
    dropIndicator
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
    ev.currentTarget.appendChild(dropIndicator)
  }, [])

  const onDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
  }, [])

  const onDragLeave = useCallback((ev: React.DragEvent) => {
    ev.preventDefault()
    dropIndicator.remove()
  }, [])

  const onDragStart = useCallback(
    (ev: React.DragEvent) => {
      ev.dataTransfer.setData('text/plain', index.toString())
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
      const dimensions = ev.currentTarget.getBoundingClientRect()
      ev.dataTransfer.setDragImage(ev.currentTarget, dimensions.width / 2, 0)

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
