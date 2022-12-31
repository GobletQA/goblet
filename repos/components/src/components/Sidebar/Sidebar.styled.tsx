import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop:string) => prop !== 'maxWidth'
})(({ maxWidth=230 }) => `

  width: 100%;
  // max-width: ${maxWidth}px;

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
  transition: color 300ms ease, background-color 300ms ease;


  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
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