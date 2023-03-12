
import Box from '@mui/material/Box'
import { colors } from '@GBC/theme'
import { styled } from '@mui/material/styles'
import { DndDraggingCls, DndHoverCls } from '@GBC/constants/values'

export const DragContainer = styled(Box)`
  display: flex;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  margin-left: -40px;
  flex-flow: row nowrap;
  padding: 4px 8px 4px 20px;
  
  &.${DndDraggingCls} {
    background-color: ${colors.gray10};
  }

  &.${DndHoverCls} {
    cursor: grabbing !important;
  }
`
export const DropContainer = styled(Box)`
  height: 12px;
  margin-left: -40px;
  width: calc(100% + 40px);
`
export const DragButton = styled(Box)`
  left: 18px;
  cursor: grab;
  display: none;
  margin-left: -20px;
  position: absolute;
`
