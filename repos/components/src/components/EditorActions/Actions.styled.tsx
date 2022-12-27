import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const ActionsContainer = styled(Box)`
  top: 0px;
  right: 0px;
  width: 35px;
  max-width: 35px;
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: var(--goblet-editor-background);
`

export const ActionsToggle = styled(Box)`
  width: 35px;
  height: 30px;
  opacity: 0.5;
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: var(--goblet-editor-foreground);
  transition: opacity 300ms ease;
  background: var(--goblet-list-activeSelectionBackground);
  
  &:hover {
    opacity: 1;
  }

  & .goblet-editor-icon-rotate {
    transition: transform 300ms, top 300ms;
    position: relative;
  }

  &.closed .goblet-editor-icon-rotate {
    top: 3px;
  }

  &.open .goblet-editor-icon-rotate {
    top: -1px;
    opacity: 1;
    transform: rotate(-180deg);
  }

`

export const ActionsToggleWrap = styled(Box)``

export const ActionsList = styled(Box)`
  height: auto;
  overflow: hidden;
  position: relative;
  transition: max-height 300ms ease;
  color: var(--goblet-editor-foreground);
`

export const ActionItem = styled(Box)`

  padding-top: 2.5px;
  padding-bottom: 2.5px;
  pointer-events: auto;
  color: var(--goblet-editor-foreground);
  background-color: var(--goblet-editor-background);

  &:first-child {
    padding-top: 5px;
  }

  & * button {
    color: var(--goblet-editor-foreground);
  }

  & * button:hover {
    color: var(--goblet-list-hoverForeground);
  }

`
