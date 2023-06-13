import { SnapCanvas } from './SnapCanvas'
import { SnapElements } from './SnapElements'
import { useSnapshotHooks } from '@hooks/snapshot/useSnapshotHooks'
import { SnapshotCanvasContainer, SnapshotContainer } from './Snapshot.styled'

export const Snapshot = () => {

  const {
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
  } = useSnapshotHooks({})

  return (
    <SnapshotContainer>
      <SnapshotCanvasContainer>
        <SnapCanvas
          onMouseUp={onMouseUp}
          canvasRef={canvasRef}
          endDrawing={endDrawing}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          startDrawing={startDrawing}
        />
        <SnapElements
          elements={elements}
          onRemove={onRemoveEl}
          selected={selectedElement}
          onTextChange={onTextChange}
        />
      </SnapshotCanvasContainer>
    </SnapshotContainer>
  )
}
