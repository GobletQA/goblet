
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
  display: flex;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  margin-left: -40px;
  flex-flow: row nowrap;
  padding: 4px 8px 4px 20px;

  &.${DndDraggingCls} {

    cursor: grabbing;
    background-color: ${colors.gray10};

    & .${DndDragHandleCls} {
      cursor: grab;
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
