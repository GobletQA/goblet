import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const BuilderContainer = styled(Box)`
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-editor-background);
`
