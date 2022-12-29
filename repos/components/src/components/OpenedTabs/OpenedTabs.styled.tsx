import { Span } from '../Text'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

export const OpenTabsContainer = styled(Box)`
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 35px;
`

export const OpenTabsMain = styled(Box)`
  width: 100%;
  height: 35px;
  display: flex;
  font-size: 14px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  flex-direction: row;
  align-items: center;
  scrollbar-width: none;
  box-sizing: border-box;
  justify-content: flex-start;
  background-color: var(--goblet-editor-background);

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
`

export const OpenTab = styled(Box)`
  height: 30px;
  display: flex;
  padding: 0px;
  padding-left: 5px;
  cursor: pointer;
  margin-right: 1px;
  position: relative;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  color: var(--goblet-list-inactiveSelectionForeground);
  background-color: var(--goblet-editor-background);

  &.focused {
    background-color: var(--goblet-list-focusBackground);
    color: var(--goblet-list-focusForeground);
  }

  &:hover {
    background-color: var(--goblet-list-hoverBackground);
    color: var(--goblet-list-hoverForeground);
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
  font-size: 13px;
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
  background-color: var(--goblet-list-hoverForeground);
`

export const OpenTabClose = styled(Span)`
  font-size: 20px;
  padding: 5px 10px;
  line-height: 20px;
  margin-left: 5px;
  position: relative;

  &:hover {
    color: var(--goblet-errorForeground);
    background-color: var(--goblet-list-focusBackground);
  }

`