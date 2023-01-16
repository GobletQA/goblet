import type { TGobletTheme } from '@GBC/types'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const ActionsContainer = styled(Box)`
  top: 0px;
  right: 0px;
  width: 37px;
  max-width: 37px;
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

export const ActionsToggle = styled(Box)(({ theme }) => `
  width: 37px;
  height: 37px;

  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: var(--goblet-tab-inactiveForeground);
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
  transition: color 300ms ease, background-color 300ms ease;

  border-left: 1px solid var(--goblet-editorGroupHeader-tabsBorder);

  &:hover {
    background-color: var(--goblet-editorGroupHeader-tabsBorder);
  }

  & .goblet-editor-icon-rotate {
    transition: transform 300ms, top 300ms;
    position: relative;
  }

  &.closed .goblet-editor-icon-rotate {
    top: 4px;
  }

  &.open {
    .goblet-editor-icon-rotate {
      top: 0px;
      transform: rotate(-180deg);
    }
  }
`)

export const ActionsToggleWrap = styled(Box)``

export const ActionsList = styled(Box)`
  height: auto;
  overflow: hidden;
  position: relative;
  transition: max-height 300ms ease;
`
export const ActionsBack = styled(Box)`
  z-index: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.75;
  position: absolute;
  background-color: var(--goblet-tab-inactiveBackground);
`

export const ActionItem = styled(Box)(({ theme }) => `
  z-index: 1;
  display: flex;
  margin-top: 2.5px;
  position: relative;
  pointer-events: auto;
  justify-content: center;
  color: var(--goblet-tab-inactiveForeground);
  transition: color 300ms ease, background-color 300ms ease;

  &:first-of-type {
    margin-top: 0px;
  }

  & > div:first-of-type {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & * button {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    background-color: transparent;
    color: var(--goblet-tab-inactiveForeground);
    transition: color 300ms ease, background-color 300ms ease;
    
    &.Mui-disabled {
      color: var(--goblet-statusBarItem-activeBackground);
    }
    
    & svg {
      width: 22px;
      height: 22px;
    }
    
  }

  &:hover {
    background-color: var(--goblet-editorGroupHeader-tabsBackground);
  }

  & * button:hover {
    color: ${(theme as TGobletTheme)?.palette?.colors?.purple10};
    background-color: transparent;
  }

`)
