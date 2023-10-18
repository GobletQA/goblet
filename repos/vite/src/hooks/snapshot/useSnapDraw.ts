import type { TDrawEls } from '@types'

import { useEffect } from 'react'
import {useInline} from '@gobletqa/components'
import { drawElements } from '@utils/snapshot/draw'
import { addShape, addText } from '@utils/snapshot/updateEls'

export type THSnapDraw = Omit<TDrawEls, `ctx`>

export const useSnapDraw = (props:THSnapDraw) => {

  const {
    tool,
    elements,
    canvasRef,
    isDrawing,
    setElements,
    endPosition,
    startPosition,
  } = props

  const startDrawing = useInline((event: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    startPosition.current = { x: event.clientX, y: event.clientY }
  })

  const endDrawing = useInline(() => {
    isDrawing.current = false
    tool === 'text'
      ? addText({
          tool,
          setElements,
          endPosition,
          startPosition,
        })
      : addShape({
          tool,
          setElements,
          endPosition,
          startPosition,
        })
  })


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas?.getContext('2d')
    ctx && drawElements({ ...props, ctx })

    return () => {
      ctx && ctx.clearRect(0, 0, canvas!.width, canvas!.height)
    }
  }, [elements])

  return {
    endDrawing,
    startDrawing,
  }

}