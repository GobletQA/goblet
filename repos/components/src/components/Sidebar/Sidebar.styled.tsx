import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const SidebarContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-shrink: 0;
  max-width: 225px;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: stretch;
  flex-direction: column;

  color: var(--goblet-editor-foreground);
  background: var(--goblet-editor-background);
`
