
import Box from '@mui/material/Box'
import { colors } from '@GBC/theme'
import { styled } from '@mui/material/styles'
import {
  DndHoverCls,
  DndDraggingCls,
  DndDragHandleCls,
} from '@GBC/constants/values'

// TODO: cursor: grabbing; not working for some reason
// Need to investigate

export const DragContainer = styled(Box)`

  background-color: transparent;

  &.${DndDraggingCls} {

    opacity: 0.5;
    cursor: grabbing !important;
    background-color: ${colors.gray00};

    & .${DndDragHandleCls} {
      cursor: grabbing !important;
    }
  }

  &.${DndHoverCls} {
    cursor: grab;

    & .${DndDragHandleCls} {
      cursor: grab;
    }
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
