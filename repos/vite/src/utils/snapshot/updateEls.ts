import type {
  TSnapEl,
  TSetEls,
  TDrawItem,
} from '@types'

export type TReplaceText = {
  index:number|null
  el:Partial<TSnapEl>
  setElements:TSetEls
}

export const addShape = (props:TDrawItem) => {
  const {
    tool,
    setElements,
    endPosition,
    startPosition
  } = props
  
  const { x: startX, y: startY } = startPosition.current
  const { x: endX, y: endY } = endPosition.current
  const width = endX - startX
  const height = endY - startY

  const shape: TSnapEl = {
    type: tool,
    startX,
    startY,
    width,
    height,
  }

  setElements((els) => [...els, shape])
}

export const addText = (props:TDrawItem) => {
  const {
    setElements,
    startPosition
  } = props
  
  const { x: startX, y: startY } = startPosition.current

  const textElement: TSnapEl = {
    type: 'text',
    startX,
    startY,
    text: '',
  }

  setElements((els) => [...els, textElement])
}

export const replaceEl = (props:TReplaceText) => {
  const {
    el,
    index,
    setElements,
  } = props

  setElements((els) => els.map((element, idx) => (
    idx === index ? { ...element, ...el } : element)
  ))
}

export const removeEl = (props:Omit<TReplaceText, `el`>) => {
  const {
    index,
    setElements,
  } = props

  setElements((els) => els.filter((el, idx) => idx !== index))
}
