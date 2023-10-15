import { Span } from '../Text'
import Box from '@mui/material/Box'
import { dims, colors } from '@GBC/theme'
import { styled } from '@mui/material/styles'

export const OpenTabsContainer = styled(Box)`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;
  height: ${dims.editor.tabs.px};
  min-height: ${dims.editor.tabs.px};
  padding-right: ${dims.editor.tabs.px};
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
`

export const OpenTabsBottomBorder = styled(Box)`
  z-index: 1;
  width: 100%;
  height: 1px;
  bottom: 0px;
  position: absolute;
  background-color: var(--goblet-editorGroupHeader-tabsBorder);
`

/**
 * TODO: Investigate the scrollbar when multiple files open
 * Need to ensure you can still scroll left and right 
 */
export const OpenTabsMain = styled(Box)`
  width: 100%;
  display: flex;
  font-size: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: start;
  white-space: nowrap;
  flex-direction: row;
  scrollbar-width: none;
  box-sizing: border-box;
  justify-content: flex-start;
  height: ${dims.editor.tabs.px};
  min-height: ${dims.editor.tabs.px};

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    opacity: 0.75;
  }
  &::-webkit-scrollbar-track {
    background: var(--goblet-editorGroupHeader-tabsBackground);
    box-shadow: inset 0 0 4px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 4px var(--goblet-scrollbar-shadow);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--goblet-scrollbarSlider-background);
    box-shadow: inset 0 0 4px var(--goblet-scrollbar-shadow);
    -webkit-box-shadow: inset 0 0 4px var(--goblet-scrollbar-shadow);
  }
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
  height: ${dims.editor.tabs.px};
  color: var(--goblet-tab-inactiveForeground);
  background-color: var(--goblet-tab-inactiveBackground);
  border-right: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;

  &.focused {
    z-index: 2;
    color: var(--goblet-tab-activeForeground);
    background-color: var(--goblet-tab-activeBackground);
    border-bottom: 1px solid var(--goblet-tab-activeBackground);
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