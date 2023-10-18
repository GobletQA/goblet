import type { TSetEls, TSnapPos, TSnapEl } from '@types'
import type { ChangeEvent, MouseEvent, MutableRefObject, RefObject } from 'react'

import { ESnapTool } from '@types'
import { useInline } from '@gobletqa/components'
import { drawElements } from '@utils/snapshot/draw'
import { findHandleIdx } from '@utils/snapshot/findHandleIdx'
import { removeEl, replaceEl } from '@utils/snapshot/updateEls'

export type TSnapActions = {
  tool:ESnapTool
  resizing:boolean
  elements:TSnapEl[]
  setElements:TSetEls
  resizingHandle:number|null
  selectedElement:number|null
  isDrawing:MutableRefObject<boolean>
  setResizing:(state:boolean) => void
  canvasRef:RefObject<HTMLCanvasElement>
  endPosition:MutableRefObject<TSnapPos>
  startPosition:MutableRefObject<TSnapPos>
  setResizingHandle:(idx:number|null) => void
  setSelectedElement:(idx:number|null) => void
}

export const useSnapActions = (props:TSnapActions) => {

  const {
    tool,
    elements,
    resizing,
    canvasRef,
    isDrawing,
    endPosition,
    setElements,
    setResizing,
    selectedElement,
    setResizingHandle,
    setSelectedElement
  } = props

  const getHandleIndex = useInline((event: MouseEvent<HTMLCanvasElement|HTMLButtonElement>) => {
    const canvas = canvasRef.current

    return canvas
      ? findHandleIdx({
          canvas,
          posY: event.clientY,
          posX: event.clientX,
          selected: elements[selectedElement!]
        })
      : -1
  })

  const onMouseMove = useInline((event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current && !resizing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const offsetX = event.clientX - canvasRect.left
    const offsetY = event.clientY - canvasRect.top

    if (!resizing) {
      const ctx = canvas?.getContext('2d')
      endPosition.current = { x: offsetX, y: offsetY }
      return ctx && drawElements({ ...props, endPosition, ctx })
    }

    const { startX, startY } = elements[selectedElement!]
    const width = offsetX - startX
    const height = offsetY - startY

    replaceEl({
      setElements,
      index: selectedElement,
      el: { width, height }
    })

  })

  const onMouseDown = useInline((event: MouseEvent<HTMLCanvasElement>) => {
    const index = getHandleIndex(event)
    if(index === -1) return

    if (tool !== ESnapTool.text) setSelectedElement(index)

    setResizing(true)
    setResizingHandle(index)
  })

  const onMouseUp = useInline(() => {
    if (!resizing) return

    setResizing(false)
    setResizingHandle(null)
  })

  const onRemoveEl = useInline((event: MouseEvent<HTMLButtonElement>) => {
    const index = getHandleIndex(event)
    index !== -1
      ? removeEl({ index, setElements })
      : console.warn(`Snapshot element could not be found`, event)
  })

  const onTextChange = useInline((event: ChangeEvent<HTMLInputElement>, index: number) => {
    replaceEl({
      index,
      setElements,
      el: { text: event.target.value }
    })
  })

  const onDownload = useInline(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = 'goblet-snapshot.png'
    link.click()
  })

  return {
    onMouseUp,
    onDownload,
    onRemoveEl,
    onMouseMove,
    onMouseDown,
    onTextChange,
    getHandleIndex
  }

}