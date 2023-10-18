import type { Dispatch, MutableRefObject, RefObject } from 'react'

export enum ESnapTool {
  text=`text`,
  draw=`draw`,
  clear=`clear`,
  arrow=`arrow`,
  square=`square`,
  picture=`picture`
}

export type TSnapEl = {
  type: ESnapTool
  startX: number
  startY: number
  width?: number
  height?: number
  text?: string
}

export type TDrawEls = {
  tool:string
  resizing:boolean
  elements:TSnapEl[]
  setElements:TSetEls
  resizingHandle:number|null
  selectedElement:number|null
  ctx: CanvasRenderingContext2D
  isDrawing:MutableRefObject<boolean>
  canvasRef:RefObject<HTMLCanvasElement>
  endPosition:MutableRefObject<TSnapPos>
  startPosition:MutableRefObject<TSnapPos>
}

export type TSnapPos = { x: number, y: number }
export type TSetEls = Dispatch<React.SetStateAction<TSnapEl[]>>

export type TDrawArrow = {
  element:TSnapEl
  ctx: CanvasRenderingContext2D
}

export type TDrawHandles = {
  element:TSnapEl
  resizing:boolean
  resizingHandle:number|null
  ctx: CanvasRenderingContext2D
}

export type TDrawItem = {
  tool:string
  setElements:TSetEls
  endPosition:MutableRefObject<TSnapPos>
  startPosition:MutableRefObject<TSnapPos>
}
