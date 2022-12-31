import Box from '@mui/material/Box'
import { TGobletTheme } from '@GBC/types'
import { getColor } from '@GBC/utils/theme'

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
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
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
  border-left: 1px solid ${getColor(`colors.gray01`, `colors.purple23`, theme as TGobletTheme)};

  &:hover {
    background-color: ${getColor(`colors.gray01`, `colors.purple23`, theme as TGobletTheme)};
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
  background-color: var(--goblet-tab-inactiveBackground);
`

export const ActionItem = styled(Box)(({ theme }) => `

  display: flex;
  margin-top: 2.5px;
  pointer-events: auto;
  justify-content: center;
  color: var(--goblet-tab-inactiveForeground);
  background-color: var(--goblet-tab-inactiveBackground);
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
    transition: color 300ms ease, background-color 300ms ease;
    background-color: transparent;
    
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
