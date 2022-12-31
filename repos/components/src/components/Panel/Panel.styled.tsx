import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'

type THeaderItem = ListItemButtonProps & { component?: ElementType }

import { Span } from '../Text'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

export const PanelSidebar = styled(Box)`
  background: var(--goblet-sideBarSectionHeader-background);
  border-bottom: 1px solid var(--goblet-sideBarSectionHeader-border);
`

const sharedPanelHeader = `
  background: var(--goblet-list-activeSelectionBackground);
  color: var(--goblet-list-activeSelectionForeground);
  
  & .goblet-editor-panel-toggle-icon {
    path {
      color: var(--goblet-list-activeSelectionForeground);
    }
  }
`

export const PanelHeader = styled(ListItemButton)<THeaderItem>`
  height: 30px;
  display: flex;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  line-height: 28px;
  font-weight: bold;
  flex-direction: row;
  flex-grow: initial;
  align-items: center;
  width: 100%;
  position: relative;
  transition: color 300ms ease, background-color 300ms ease, border 300ms ease;
  color: var(--goblet-sideBarSectionHeader-foreground);
  background: var(--goblet-sideBarSectionHeader-background);
  border-bottom: 1px solid transparent;
  padding-left: 5px;
  padding-right: 5px;

  &:hover {
    ${sharedPanelHeader}
  }

  &.open {
    ${sharedPanelHeader}
    border-bottom: 1px solid var(--goblet-sideBarSectionHeader-border);
  }


  & .goblet-editor-panel-toggle-icon {
    font-size: 18px;
    font-weight: bold;
    margin-right: 4px;
    
    & path {
      color: var(--goblet-list-inactiveSelectionForeground);
    }

  }

`


export const PanelHeaderText = styled(Span)`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
`

export const PanelContent = styled(Box)`
  height: auto;
  overflow:hidden;
  position: relative;
  padding-bottom: 0px;
  transition: max-height 300ms ease, padding-bottom 300ms ease;
`

export const PanelSidebarMonaco = styled(Box)`
`
