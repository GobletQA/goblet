import { dims } from '@GBC/theme'
import Box from '@mui/material/Box'
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
  max-width: ${dims.editor.tabs.px};
`)

export const ActionsToggle = styled(Box)(({ theme }) => `
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: ${dims.editor.tabs.px};
  height: ${dims.editor.tabs.height - 1}px;
  color: var(--goblet-tab-inactiveForeground);
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;
  box-sizing: border-box;

  &:hover {
    background-color: var(--goblet-editorGroupHeader-tabsBorder);
  }

  & .goblet-editor-icon-rotate {
    position: relative;
    transition: transform ${dims.trans.avg}, top ${dims.trans.avg};
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
  opacity: 0;
  height: auto;
  overflow: hidden;
  position: relative;
  transition: max-height ${dims.trans.avg} ease, opacity 500ms ease;
  
  &.open {
    overflow: visible;
  }
  
`
export const ActionsBack = styled(Box)`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  position: absolute;
  box-shadow: -3px 3px 5px -5px rgba(0,0,0,0.2);
  background-color: var(--goblet-editorGroupHeader-tabsBackground);
`

export const ActionItem = styled(Box)(({ theme }) => `
  z-index: 1;
  display: flex;
  margin-top: 2.5px;
  position: relative;
  pointer-events: auto;
  justify-content: center;
  color: var(--goblet-tab-inactiveForeground);
  transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;

  &:first-of-type {
    margin-top: 0px;
  }

  & > div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${dims.editor.tabs.px};
    height: ${dims.editor.tabs.px};
  }

  & * button {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    background-color: transparent;
    color: var(--goblet-tab-inactiveForeground);
    transition: color ${dims.trans.avg} ease, background-color ${dims.trans.avg} ease;
    
    &.Mui-disabled {
      color: var(--goblet-list-deemphasizedForeground);
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
    color: ${theme?.palette?.colors?.purple10};
    background-color: transparent;
  }

`)
