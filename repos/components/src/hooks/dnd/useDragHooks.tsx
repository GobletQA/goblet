import type { TOnDrop } from './useDndHooks'
import type { RefObject, DragEvent } from 'react'

import { useCallback } from 'react'
import { uuid, toInt } from '@keg-hub/jsutils'
import { DndDraggingCls } from '@GBC/constants/values'

const separator = `|>${uuid()}<|`

export type THDragHooks = {
  index: number
  data?:string
  onDrop: TOnDrop
  dragImagePos?:[number, number]
  dragDivRef: RefObject<HTMLDivElement>
  dropIndicatorRef:RefObject<HTMLHRElement>
}

export const useDragHooks = (props:THDragHooks) => {

  const {
    data,
    index,
    onDrop,
    dragDivRef,
    dropIndicatorRef,
    dragImagePos=[0,0],
  } = props

  const onDropBefore = useCallback(
    (evt: DragEvent) => {
      evt.preventDefault()
      const [oldData, oldIdxStr] = evt.dataTransfer.getData('text/plain').split(separator)
      const oldIndex = toInt(oldIdxStr)
      onDrop(oldIndex, index, oldData, data)
    },
    [onDrop, index, data]
  )

  const onDropAfter = useCallback(
    (evt: DragEvent) => {
      evt.preventDefault()
      const [oldData, oldIdxStr] = evt.dataTransfer.getData('text/plain').split(separator)
      const oldIndex = toInt(oldIdxStr)

      const newIndex = index >= oldIndex ? index : index + 1
      onDrop(oldIndex, newIndex, oldData, data)
    },
    [onDrop, index, data]
  )

  const onDragEnter = useCallback((evt: DragEvent) => {
    evt.preventDefault()
    dropIndicatorRef.current && 
      evt.currentTarget.appendChild(dropIndicatorRef.current)
  }, [])

  const onDragOver = useCallback((evt: DragEvent) => {
    evt.preventDefault()
  }, [])

  const onDragLeave = useCallback((evt: DragEvent) => {
    evt.preventDefault()
    dropIndicatorRef.current?.remove()
  }, [])

  const onDragStart = useCallback(
    (evt: DragEvent) => {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('text/plain', `${data}${separator}${index.toString()}`)
      evt.dataTransfer.setDragImage(evt.currentTarget, ...dragImagePos)
      dragDivRef.current?.classList.add(DndDraggingCls)
    },
    [index, data, dragDivRef]
  )

  const onDragEnd = useCallback(
    (evt: DragEvent) => {
      onDragLeave(evt)
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
