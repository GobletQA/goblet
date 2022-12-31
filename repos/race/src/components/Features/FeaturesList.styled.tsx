import type { ElementType } from 'react'
import type { ListProps, ListItemButtonProps } from '@mui/material'

import List from '@mui/material/List'
import { styled } from '@mui/material/styles'

import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

type TListFeatures = ListProps & { component?: ElementType }
type TFeatureItem = ListItemButtonProps & { component?: ElementType }

export const Features = styled(List)<TListFeatures>`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  padding-top: 0px;

  & ul {
    padding: 0px;
  }
`

const shared = `
  color: var(--goblet-list-hoverForeground);
  background-color: var(--goblet-list-hoverBackground);
  border-top: 1px solid var(--goblet-sideBarSectionHeader-border);
  border-bottom: 1px solid var(--goblet-sideBarSectionHeader-border);
`

export const FeatureItem = styled(ListItemButton)<TFeatureItem>`
  padding: 1px 0px;
  padding-left: 10px;
  color: var(--goblet-list-inactiveSelectionForeground);
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;

  &:hover {
    ${shared}
  }

  &.active {
    ${shared}
  }
`

export const FeatureText = styled(ListItemText)`
  margin: 0px;

  & span {
    font-size: 14px;
    line-height: 24px;
  }
`


