import { useSnapRefs } from './useSnapRefs'
import { useSnapDraw } from './useSnapDraw'
import { useLoadSnapImg } from './useLoadSnapImg'
import { useSnapActions } from './useSnapActions'

export type THSnapshot = {
  imgUrl?:string
}

export const useSnapshotHooks = (props:THSnapshot) => {

  const {
    imgUrl
  } = props

  const {
    text,
    tool,
    resizing,
    canvasRef,
    elements,
    isDrawing,
    setElements,
    setResizing,
    endPosition,
    startPosition,
    resizingHandle,
    selectedElement,
    setResizingHandle,
    setSelectedElement,
  } = useSnapRefs()

  useLoadSnapImg({
    imgUrl,
    canvasRef
  })

  const {
    endDrawing,
    startDrawing,
  } = useSnapDraw({
    tool,
    elements,
    resizing,
    isDrawing,
    canvasRef,
    setElements,
    endPosition,
    startPosition,
    resizingHandle,
    selectedElement
  })
  
  const {
    onMouseUp,
    onRemoveEl,
    onDownload,
    onMouseMove,
    onMouseDown,
    onTextChange,
  } = useSnapActions({
    tool,
    elements,
    resizing,
    isDrawing,
    canvasRef,
    setElements,
    endPosition,
    setResizing,
    startPosition,
    resizingHandle,
    selectedElement,
    setResizingHandle,
    setSelectedElement,
  })


  return {
    text,
    elements,
    canvasRef,
    onMouseUp,
    onDownload,
    onRemoveEl,
    endDrawing,
    onMouseMove,
    onMouseDown,
    startDrawing,
    onTextChange,
    selectedElement
  }

}