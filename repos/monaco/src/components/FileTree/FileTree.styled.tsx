import Box from '@mui/material/Box'
import { dims, Span } from '@gobletqa/components'
import { styled } from '@mui/material/styles'


export const TreeItemActionsContainer = styled(Span)`
  right: 0px;
  height: 25px;
  padding-top: 3px;
  padding-left: 5px;
  position: absolute;
`

export const TreeItemName = styled(Span)`
  flex: 1;
  line-height: 24px;
`

export const DirectoryEdit = styled(Box)``

export const TreeItemContainer = styled(Box, {
   shouldForwardProp: (prop) => prop !== `parentPath`
})(({ parentPath }:Record<`parentPath`, string>) => `
  position: relative;
  padding-left: ${
    parentPath === `/`
      ? `5px`
      : `${(parentPath.split(`/`).length + 1) *  4}px`
  };

  &.goblet-editor-file-item-row-focused {
    background-color: var(--goblet-list-focusBackground);
    color: var(--goblet-list-focusForeground);
  }

  &.goblet-editor-file-item-row {
    display: flex;
    cursor: pointer;
    padding-top: 1px;
    user-select: none;
    flex-direction: row;
    align-items: center;
    padding-bottom: 1px;

    & .goblet-editor-file-item-icon {
      visibility: hidden;
      color: var(--goblet-editor-foreground);
      
      &:hover {
        color: var(--goblet-list-highlightForeground);
      }

    }

    &:hover {
      background-color: var(--goblet-list-hoverBackground);
      color: var(--goblet-list-hoverForeground);
      
      & .gb-editor-actions-container {
        background-color: var(--goblet-list-hoverBackground);
      }
      
      & .goblet-editor-file-item-icon {
        visibility: visible;
      }
      
    }
  }

`)