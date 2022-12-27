import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const SidebarContainer = styled(Box)`
  display: flex;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: stretch;
  flex-direction: column;
  width: 100%;
  max-width: 225px;

  color: var(--goblet-editor-foreground);
  background: var(--goblet-editor-background);
`
