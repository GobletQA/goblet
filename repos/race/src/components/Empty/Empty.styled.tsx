import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

export const EmptyContainer = styled(Box)`
  z-index: 1;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 0;
  display: flex;
  user-select: none;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: var(--goblet-editor-background);
`

export const EmptyContent = styled(Box)`
  top: -20px;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`