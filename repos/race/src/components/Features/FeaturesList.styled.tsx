import type { ElementType } from 'react'
import type { ListProps, ListItemButtonProps } from '@mui/material'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import { colors, Span } from '@gobletqa/components'

import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

type TListFeatures = ListProps & { component?: ElementType }
type TFeatureItem = ListItemButtonProps & { component?: ElementType }

export const Features = styled(List)<TListFeatures>`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-top: 0px;
  position: relative;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { 
    display: none;
  }

  & ul {
    padding: 0px;
  }
`

const shared = `
  color: var(--goblet-list-hoverForeground);
  background-color: var(--goblet-list-hoverBackground);
`

export const FeaturesGroup = styled(Box)<TListFeatures>`
  min-height: 30px;
  padding: 1px 0px;
  padding-left: 2px;

  & .gb-dropdown {
    background-color: inherit;
  }
  
  & > .gb-dropdown > .gb-dropdown-header {
    height: 30px;
    color: var(--goblet-list-inactiveSelectionForeground);

    & h5 {
      font-weight: bold;
    }

    & .gb-dropdown-expand-icon {
      color: var(--goblet-list-inactiveSelectionForeground);
    }
  }

  & .MuiAccordionSummary-content {
    margin:  0px;
  }
  
  & > .gb-dropdown > .gb-dropdown-header:hover {
    ${shared}

    & .gb-dropdown-expand-icon {
      color: var(--goblet-list-hoverForeground);
    }
  }

`

export const FeaturesGroupContainer = styled(Box)<TListFeatures>`
  padding-left: 10px;
`

export const FeatureItem = styled(ListItemButton)<TFeatureItem>`
  height: 30px;
  padding: 1px 0px;
  padding-left: 10px;
  color: var(--goblet-list-inactiveSelectionForeground);

  &:hover {
    ${shared}
  }

  &.active {
    ${shared}
  }
`

export const FeatureItemName = styled(ListItemText)`
  margin: 0px;

  & span {
    font-size: 14px;
    line-height: 24px;
  }
`

export const FeatureItemActionsContainer = styled(Span)`
  right: 0px;
  height: 25px;
  padding-top: 3px;
  padding-left: 5px;
  position: absolute;
  
  & .gb-race-feature-item-icon {
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

export const DirectoryEdit = styled(Box)``
