import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

export const EditorButton = styled(Box)`
  font-size: 14px;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 20px;
  background: var(--goblet-button-background);
  
  &:hover {
    opacity: 0.8;
  }

  &.goblet-editor-button-primary {
    background: var(--goblet-editorCursor-foreground);
  }
  
`