import type { MouseEvent, RefObject} from "react"
import { SnapshotCanvas } from './Snapshot.styled'

type TMouseCB = (event: MouseEvent<HTMLCanvasElement>) => void | null


export type TSnapCanvas = {
  onMouseUp:()=>void
  endDrawing:()=>void
  onMouseMove:TMouseCB
  onMouseDown:TMouseCB
  startDrawing:TMouseCB
  canvasRef:RefObject<HTMLCanvasElement>
}

export const SnapCanvas = (props:TSnapCanvas) => {

  const {
    canvasRef,
    onMouseUp,
    endDrawing,
    onMouseMove,
    onMouseDown,
    startDrawing,
  } = props

  return (
    <SnapshotCanvas
      ref={canvasRef}
      onMouseUp={endDrawing}
      onMouseMove={onMouseMove}
      onMouseDown={startDrawing}
      onMouseUpCapture={onMouseUp}
      onMouseDownCapture={onMouseDown}
      style={{ border: '1px solid black' }}
    />
  )
}

