import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'
import { colors } from '@GBC/theme'

type THeaderItem = ListItemButtonProps & { component?: ElementType }

import { Span } from '../Text'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

export const PanelSidebar = styled(Box)`
  background: var(--goblet-sideBarSectionHeader-background);
  border-bottom: 1px solid transparent;

  &.open {
    border-bottom: 1px solid var(--goblet-sideBarSectionHeader-border);
  }

`

const sharedPanelHeader = `
  color: var(--goblet-list-activeSelectionForeground);
  background: var(--goblet-statusBarItem-hoverBackground);

  & .gb-panel-toggle-icon {
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
  padding-left: 5px;
  padding-right: 5px;

  &:hover:not(.no-hover) {
    ${sharedPanelHeader}
  }

  &.open:not(.no-hover) {
    ${sharedPanelHeader}
  }

  &.no-click {
    pointer-events: none;
  }


  & .gb-panel-toggle-icon {
    font-size: 20px;
    font-weight: bold;
    margin-right: 4px;

    & path {
      color: var(--goblet-sideBarSectionHeader-foreground);
    }
  }
  
  & .gb-panel-header-action {
    font-size: 16px;
    margin-right: 5px;
    pointer-events: initial;
    transition: color 300ms ease;
    color: var(--goblet-sideBarSectionHeader-foreground);
    
    &:hover {
      color: ${colors.royalPurple} !important;
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
  padding-top: 0px;
  padding-bottom: 0px;
  transition: max-height 300ms ease, padding-top 300ms ease, padding-bottom 300ms ease;

  &.show {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`

export const PanelSidebarMonaco = styled(Box)`
`
