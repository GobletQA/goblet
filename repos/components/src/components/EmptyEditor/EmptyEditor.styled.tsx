import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {gutter} from '@theme'

export const EmptyEditorContainer = styled(Box)`
  z-index: 20;
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

export const EmptyEditorContent = styled(Box)`
  top: -20px;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
`