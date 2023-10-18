import type { TSnapEl } from '@types'


export type TFindHandle = {
  posX:number
  posY:number
  selected:TSnapEl
  canvas?:HTMLCanvasElement
}

export const findHandleIdx = (props:TFindHandle) => {
    const {
      posX, // event.clientX
      posY, // event.clientY
      canvas,
      selected, // const selected = elements[selectedElement!]
    } = props

    if (!canvas) return -1

    const canvasRect = canvas.getBoundingClientRect()
    const offsetY = posY - canvasRect.top
    const offsetX = posX - canvasRect.left

    const handles = [
      { x: selected.startX, y: selected.startY },
      { x: selected.startX + selected.width!, y: selected.startY },
      { x: selected.startX + selected.width!, y: selected.startY + selected.height! },
      { x: selected.startX, y: selected.startY + selected.height! },
    ]

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i]
      const handleRect = {
        width: 8,
        height: 8,
        top: handle.y - 4,
        left: handle.x - 4,
      }

      const gtTop = offsetY >= handleRect.top
      const gtLeft = offsetX >= handleRect.left
      const ltTopHeight = offsetY <= handleRect.top + handleRect.height
      const ltLeftWidth = offsetX <= handleRect.left + handleRect.width

      if (gtLeft && ltLeftWidth && gtTop && ltTopHeight)
        return i
    }

    return -1
  }
