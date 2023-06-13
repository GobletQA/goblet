import type {
  TDrawEls,
  TDrawArrow,
  TDrawHandles,
} from '@types'


const drawArrow = ({
  ctx,
  element
}:TDrawArrow) => {
  const width = element.width!
  const height = element.height!
  const { startX, startY } = element
  
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(startX + width, startY + height)
  ctx.lineTo(startX + width / 4, startY + height / 4)
  ctx.moveTo(startX + width, startY + height)
  ctx.lineTo(startX + width / 4, startY + height - height / 4)
  ctx.closePath()
  ctx.stroke()
}

const drawHandles = ({
  ctx,
  element,
  resizing,
  resizingHandle,
}:TDrawHandles) => {
  
  const width = element.width!
  const height = element.height!
  const { startX, startY } = element
  
  const handles = [
    { x: startX, y: startY },
    { x: startX + width, y: startY },
    { x: startX + width, y: startY + height },
    { x: startX, y: startY + height },
  ]

  ctx.fillStyle = 'red'

  handles.forEach((handle, index) => {
    ctx.fillRect(handle.x - 4, handle.y - 4, 8, 8)

    if (resizing && resizingHandle === index) {
      ctx.fillStyle = 'white'
      ctx.fillRect(handle.x - 3, handle.y - 3, 6, 6)
      ctx.fillStyle = 'red'
    }
  })
}


export const drawElements = (props:TDrawEls) => {

  const {
    ctx,
    elements,
    resizing,
    canvasRef,
    resizingHandle,
    selectedElement
  } = props
  
  const canvas = canvasRef.current
  if (!canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(canvasRef.current, 0, 0)

  elements.forEach((element, index) => {
    if (element.type === 'arrow')
      drawArrow({ ctx, element })

    else if (element.type === 'square') {
      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 2
      ctx.strokeRect(element.startX, element.startY, element.width!, element.height!)
    }

    else if (element.type === 'text') {
      ctx.font = '18px Arial'
      ctx.fillStyle = 'black'
      ctx.fillText(element.text!, element.startX, element.startY)
    }

    if (selectedElement === index)
      drawHandles({
        ctx,
        element,
        resizing,
        resizingHandle,
      })
  })
}
