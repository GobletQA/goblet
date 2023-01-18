import Box from '@mui/material/Box'
import { Span } from '@gobletqa/components'
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
      ? `4px`
      : `${(parentPath.split(`/`).length + 1) *  6}px`
  };
`)