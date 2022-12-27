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
  padding: 8px 4px;
  cursor: pointer;

  & .goblet-panel-header-icon:hover {
    color: var(--goblet-list-hoverForeground);
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
  border-bottom: 1px solid #D3D7DE;
  transition: max-height 300ms ease, padding-bottom 300ms ease;

  &.show {
    padding-bottom: 5px;
  }
  
`
