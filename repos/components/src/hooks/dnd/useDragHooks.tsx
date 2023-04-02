import type { TOnDrop, TDndOptionalCallbacks } from '@GBC/types'
import type { RefObject, DragEvent } from 'react'

import { EDndPos } from '@GBC/types'
import { useCallback } from 'react'
import { DndDraggingCls } from '@GBC/constants/values'
import { preDef } from '@GBC/utils/dom/preventDefault'
import { stopProp } from '@GBC/utils/dom/stopPropagation'
import { uuid, toInt, parseJSON, emptyObj } from '@keg-hub/jsutils'

const separator = `|>${uuid()}<|`

export type THDragHooks = TDndOptionalCallbacks & {
  index: number
  data?:string
  onDrop: TOnDrop
  dragImagePos?:[number, number]
  dragDivRef: RefObject<HTMLDivElement>
  dropIndicatorRef:RefObject<HTMLHRElement>
}

const onDragDrop = (
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
    onDragEnd:dragEndCB,
    onDragOver:dragOverCB,
    onDragLeave:dragLeaveCB,
    onDragEnter:dragEnterCB,
    onDragStart:dragStartCB,
  } = props

  const onDropBefore = useCallback(
    preDef((evt: DragEvent) => {
      const [oldData, oldIdxStr] = evt.dataTransfer.getData('text/plain').split(separator)
      onDragDrop(
        onDrop,
        oldIdxStr,
        index,
        EDndPos.before,
        oldData,
        data
      )
    }),
    [onDrop, index, data]
  )

  const onDropAfter = useCallback(
    preDef((evt: DragEvent) => {
      const [oldData, oldIdxStr] = evt.dataTransfer.getData('text/plain').split(separator)
      onDragDrop(
        onDrop,
        oldIdxStr,
        index,
        EDndPos.after,
        oldData,
        data
      )
    }),
    [onDrop, index, data]
  )

  const onDragEnter = useCallback(preDef((evt: DragEvent) => {
    dropIndicatorRef.current && 
      evt.currentTarget.appendChild(dropIndicatorRef.current)

    ;dragEnterCB?.(evt)
  }), [])

  const onDragOver = useCallback(preDef((evt: DragEvent) => {
    dragOverCB?.(evt)
  }), [])

  const onDragLeave = useCallback(preDef((evt: DragEvent, onEnd?:boolean) => {
    dropIndicatorRef.current?.remove()
    !onEnd && dragLeaveCB?.(evt)
  }), [])

  const onDragStart = useCallback(
    stopProp((evt: DragEvent) => {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('text/plain', `${data}${separator}${index.toString()}`)
      evt.dataTransfer.setDragImage(evt.currentTarget, ...dragImagePos)
      dragDivRef.current?.classList.add(DndDraggingCls)
      dragStartCB?.(evt)
    }),
    [index, data, dragDivRef]
  )

  const onDragEnd = useCallback(
    (evt: DragEvent) => {
      onDragLeave(evt, true)
      dragDivRef.current?.classList.remove(DndDraggingCls)
      dragEndCB?.(evt)
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
