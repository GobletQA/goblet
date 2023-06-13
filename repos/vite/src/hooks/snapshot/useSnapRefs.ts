import type { Dispatch } from 'react'
import type {
  TSnapEl,
  TSnapPos,
  TSnapshotEvt,
} from '@types'

import { ESnapTool } from '@types'
import { useRef, useState } from 'react'
import {useOnEvent} from '@gobletqa/components'
import {SnapshotToolEvt} from '@constants/events'

export type TSetEls = Dispatch<React.SetStateAction<TSnapEl[]>>

export const useSnapRefs = () => {

  const isDrawing = useRef(false)
  const [text, setText] = useState<string>('')
  const [resizing, setResizing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<TSnapEl[]>([])
  const endPosition = useRef<TSnapPos>({ x: 0, y: 0 })
  const startPosition = useRef<TSnapPos>({ x: 0, y: 0 })
  const [tool, setTool] = useState<ESnapTool|null>(ESnapTool.arrow)
  const [resizingHandle, setResizingHandle] = useState<number | null>(null)
  const [selectedElement, setSelectedElement] = useState<number | null>(null)

  useOnEvent<TSnapshotEvt>(SnapshotToolEvt, ({ type }) => {
    if(type !== `clear`)
      return type !== tool && setTool(type)

    setText(``)
    setTool(null)
    setElements([])
    setResizing(false)
    setResizingHandle(null)
    setSelectedElement(null)
    endPosition.current = { x: 0, y: 0 }
    startPosition.current = { x: 0, y: 0 }
  })

  return {
    text,
    tool,
    setTool,
    setText,
    resizing,
    canvasRef,
    elements,
    isDrawing,
    setElements,
    setResizing,
    endPosition,
    startPosition,
    resizingHandle,
    setResizingHandle,
    selectedElement,
    setSelectedElement,
  }

}