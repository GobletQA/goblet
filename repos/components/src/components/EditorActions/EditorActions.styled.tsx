import Box from '@mui/material/Box'
import { dims, gutter } from '@GBC/theme'
import { styled } from '@mui/material/styles'

export const ActionsContainer = styled(Box)(({ theme }) => `
  top: 0px;
  right: 0px;
  z-index: 10;
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: ${dims.editor.tabs.px};
  height: ${dims.editor.tabs.px};
  max-width: ${dims.editor.tabs.px};
  padding-right: ${gutter.padding.hpx};
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
`)
