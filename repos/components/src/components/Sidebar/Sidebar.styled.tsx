import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { SidebarOpenWidth, dims, gutter } from '@gobletqa/components'

export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop:string) => prop !== 'maxWidth'
})(({ maxWidth=SidebarOpenWidth }) => `

  width: 100%;
  padding-bottom: ${gutter.padding.px};

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  line-height: 24px;
  align-self: stretch;
  color: var(--goblet-editor-foreground);
  background: var(--goblet-sideBar-background);
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease, width ${dims.trans.avg} ease;

  &::-webkit-scrollbar {
    width: 1px;
    height: 1px;
  }

  &::-webkit-scrollbar-track {
    background: var(--goblet-sideBar-border);
    box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--goblet-scrollbarSlider-background);
    box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
  }

  &::-webkit-scrollbar-corner,
  &::-webkit-resizer {
    border-radius: 3px;
    background: var(--goblet-scrollbarSlider-background);
    box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 5px var(--goblet-scrollbar-shadow);
  }

`)