import type { TOnDrop } from './useDndHooks'
import type { RefObject, DragEvent } from 'react'


import { EDndPos } from '@GBC/types'
import { useCallback } from 'react'
import { DndDraggingCls } from '@GBC/constants/values'
import { uuid, toInt, parseJSON, emptyObj } from '@keg-hub/jsutils'

const separator = `|>${uuid()}<|`

export type THDragHooks = {
  index: number
  data?:string
  onDrop: TOnDrop
  dragImagePos?:[number, number]
  dragDivRef: RefObject<HTMLDivElement>
  dropIndicatorRef:RefObject<HTMLHRElement>
}

const callOnDrop = (
  onDrop:TOnDrop,
  oldIndex:string,
  index:string|number,
  pos:EDndPos,
  oldData?:string,
  data?:string
) => onDrop?.(
  toInt(oldIndex),
  toInt(index),
  pos,
  oldData ? parseJSON(oldData) : emptyObj,
  data ? parseJSON(data) : emptyObj
)

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
      callOnDrop(
        onDrop,
        oldIdxStr,
        index,
        EDndPos.before,
        oldData,
        data
      )
    },
    [onDrop, index, data]
  )

  const onDropAfter = useCallback(
    (evt: DragEvent) => {
      evt.preventDefault()
      const [oldData, oldIdxStr] = evt.dataTransfer.getData('text/plain').split(separator)
      callOnDrop(
        onDrop,
        oldIdxStr,
        index,
        EDndPos.after,
        oldData,
        data
      )
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
