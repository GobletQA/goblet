import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  border-right: 1px solid #E4E6EB;

  color: var(--goblet-editor-foreground);
`

export const Divider = styled(Box)`
  width: 1px;
  height: 100%;
  flex-shrink: 0;
  background: #E4E6EB;
  
  cursor: col-resize;
  background: var(--goblet-editorCursor-foreground);
  background: var(--goblet-editor-background);

  &:hover {
    background: var(--goblet-editorCursor-foreground);
  }

`
