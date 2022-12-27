import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'

type THeaderItem = ListItemButtonProps & { component?: ElementType }

import { Span } from '../Text'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

export const PanelSidebar = styled(Box)`
  // padding-left: 5px;
  // padding-right: 5px;
`

export const PanelHeader = styled(ListItemButton)<THeaderItem>`
    left: -5px;
    height: 30px;
    display: flex;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    line-height: 28px;
    padding-left: 5px;
    font-weight: bold;
    flex-direction: row;
    align-items: center;
    width: calc( 100% + 5px );
    position: relative;
    background: var(--goblet-list-activeSelectionBackground);
    border-bottom: 2px solid var(--goblet-editor-background);

  

  & .goblet-editor-panel-toggle-icon {
    font-size: 16px;
    margin-right: 4px;
    color: var(--goblet-editor-foreground);

    &:hover {
      color: var(--goblet-list-hoverForeground);
    }
  }

`


export const PanelHeaderText = styled(Span)`
  flex: 1;
  padding-left: 5px;
`

export const PanelContent = styled(Box)`
  height: auto;
  overflow:hidden;
  position: relative;
  padding-bottom: 0px;
  transition: max-height 300ms ease, padding-bottom 300ms ease;

  &.show {
    padding-bottom: 5px;
  }
  
`

export const PanelSidebarMonaco = styled(Box)`
`
