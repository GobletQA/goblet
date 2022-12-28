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


export const FeatureItem = styled(ListItemButton)<TFeatureItem>`
  padding: 0px;
  padding-left: 10px;

  &:hover {
    background-color: var(--goblet-list-hoverBackground);
    color: var(--goblet-list-hoverForeground);
  }

  &.active {
    background-color: var(--goblet-list-hoverBackground);
    color: var(--goblet-list-hoverForeground);
  }
`

export const FeatureText = styled(ListItemText)`
  margin: 0px;

  & span {
    font-size: 14px;
    line-height: 24px;
  }
`


