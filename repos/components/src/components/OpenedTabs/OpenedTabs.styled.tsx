import { Span } from '../Text'
import { dims } from '@GBC/theme'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { TabsAllowXScrollCls } from '@GBC/constants/values'

const scrollbar = 10
const scrollHpx = `${dims.editor.tabs.height + scrollbar}px`

const scrollStyle = `
  overflow-x: hidden;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;

  &.${TabsAllowXScrollCls} {
    scroll-behavior: auto;
    overflow-x: auto !important;
  }

  &::-webkit-scrollbar {
    width: ${scrollbar}px;
    height: ${scrollbar}px;
    background:transparent;
  }

  &::-webkit-scrollbar-track {
    background: var(--goblet-scrollbarSlider-hoverBackground);
    box-shadow: inset 0 0 8px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 8px var(--goblet-scrollbar-shadow);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: var(--goblet-scrollbarSlider-background);
    box-shadow: inset 0 0 8px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 8px var(--goblet-scrollbar-shadow);
  }

  &:hover {
    cursor: pointer;
    overflow-x: auto;
    overflow-y: hidden;
    
    & .gb-editor-opened-tabs-background {
      background-color: transparent;
    }

  }
`

export const OpenTabsContainer = styled(Box)`
  width: calc( 100% - ${dims.editor.tabs.px} );
  max-width: calc( 100% - ${dims.editor.tabs.px} );
  position: relative;
  box-sizing: border-box;
  height: ${scrollHpx};
  min-height: ${scrollHpx};
  background-color: var(--goblet-editor-background);

  ${scrollStyle}
`

export const OpenTabsMain = styled(Box)`
  width: 100%;
  display: flex;
  font-size: 12px;
  align-items: start;
  white-space: nowrap;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  height: ${scrollHpx};
  min-height: ${scrollHpx};
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
  border-bottom: ${scrollbar}px solid var(--goblet-editor-background);;
`

export const OpenTab = styled(Box)`
  display: flex;
  padding: 0px;
  cursor: pointer;
  margin-top: 1px;
  margin-right: 0px;
  padding-left: 10px;
  position: relative;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: ${dims.editor.tabs.height - 1}px;
  border-bottom: 2px solid transparent;
  color: var(--goblet-tab-inactiveForeground);
  background-color: var(--goblet-tab-inactiveBackground);
  border-right: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;

  &.focused {
    z-index: 2;
    color: var(--goblet-tab-activeForeground);
    background-color: var(--goblet-tab-activeBackground);
    border-bottom: 2px solid var(--goblet-tab-activeBorder);
  }

  &:hover {
    color: var(--goblet-tab-activeForeground);
    background-color: var(--goblet-tab-activeBackground);

    & .goblet-editor-opened-tab-item-close {
      color: var(--goblet-errorForeground);
      background-color: var(--goblet-tab-activeBackground);
    }

  }

  & .goblet-editor-opened-tab-item-edit {
    visibility: hidden;
  }

  &.editing .goblet-editor-opened-tab-item-edit {
    visibility: visible;
  }

`

export const OpenTabTitle = styled(Span)`
  flex: 1;
  font-size: 12px;
  line-height: 30px;
  paddingRight: 5px;
  pointer-events: none;
`

export const OpenTabEditing = styled(Span)`
  right: 10px;
  top: 15px;
  width: 7px;
  height: 7px;
  position: absolute;
  border-radius: 50%;
  background-color: var(--goblet-tab-activeForeground);
`

export const OpenTabClose = styled(Span)`
  font-size: 20px;
  padding: 5px 10px;
  line-height: 20px;
  margin-left: 5px;
  position: relative;
  color: transparent;
  background: transparent;
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;
  
  & svg {
    font-size: 12px;
  }

`