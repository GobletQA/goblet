import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'

type THeaderItem = ListItemButtonProps & { component?: ElementType }

import { Span } from '../Text'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { dims, gutter, colors } from '@GBC/theme'
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
  background: var(--goblet-list-hoverBackground);

  & .gb-panel-toggle-icon {
    path {
      color: var(--goblet-list-activeSelectionForeground);
    }
  }
`

export const PanelHeader = styled(ListItemButton)<THeaderItem>`
  width: 100%;
  display: flex;
  cursor: pointer;
  font-weight: bold;
  flex-grow: initial;
  position: relative;
  align-items: center;
  flex-direction: row;
  padding-left: ${gutter.padding.qpx};
  padding-right: ${gutter.padding.qpx};
  height: ${dims.sidebar.panel.header.px};
  color: var(--goblet-sideBarSectionHeader-foreground);
  background: var(--goblet-sideBarSectionHeader-background);
  transition: color ${dims.trans.avgEase}, background-color ${dims.trans.avgEase}, border ${dims.trans.avgEase};

  &.no-hover:hover {
    background: var(--goblet-sideBarSectionHeader-background);
  }

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
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
    & path {
      color: var(--goblet-sideBarSectionHeader-foreground);
    }
  }
  
  & .gb-panel-header-action {
    font-size: 16px;
    pointer-events: initial;
    transition: color ${dims.trans.avgEase};
    margin-right: ${gutter.margin.qpx};
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
  padding-top: 0px;
  position: relative;
  padding-bottom: 0px;
  transition: max-height ${dims.trans.avgEase}, padding-top ${dims.trans.avgEase}, padding-bottom ${dims.trans.avgEase};

  &.show {
    padding-top: ${gutter.padding.qpx};
    padding-bottom: ${gutter.padding.qpx};
  }
`

export const PanelSidebarMonaco = styled(Box)`
`
