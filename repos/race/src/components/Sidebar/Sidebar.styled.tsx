import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const SidebarContainer = styled(Box)`
  display: flex;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  // padding-left: 5px;
  // padding-right: 5px;
  align-self: stretch;
  flex-direction: column;
  width: 100%;
  max-width: 225px;

  // color: var(--monaco-editor-foreground);
  // background: var(--monaco-editor-background);
`
