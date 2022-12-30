import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop:string) => prop !== 'maxWidth'
})(({ maxWidth=230 }) => `

  width: 100%;
  // max-width: ${maxWidth}px;

  flex-shrink: 0;
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  line-height: 24px;
  align-self: stretch;
  color: var(--goblet-editor-foreground);
  background: var(--goblet-editor-background);


  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--goblet-editor-background);
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