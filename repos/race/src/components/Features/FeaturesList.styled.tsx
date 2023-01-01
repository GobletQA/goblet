import type { ElementType } from 'react'
import type { ListProps, ListItemButtonProps } from '@mui/material'

import Box from '@mui/material/Box'
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
`

export const FeaturesGroup = styled(Box)<TListFeatures>`
  min-height: 30px;
  padding: 1px 0px;
  padding-left: 2px;

  & .gc-dropdown {
    background-color: inherit;
  }
  
  & > .gc-dropdown > .gc-dropdown-header {
    height: 30px;
    color: var(--goblet-list-inactiveSelectionForeground);

    & h5 {
      font-weight: bold;
    }

    & .gr-dropdown-expand-icon {
      color: var(--goblet-list-inactiveSelectionForeground);
    }
  }

  & .MuiAccordionSummary-content {
    margin:  0px;
  }
  
  & > .gc-dropdown > .gc-dropdown-header:hover {
    ${shared}

    & .gr-dropdown-expand-icon {
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

export const FeatureText = styled(ListItemText)`
  margin: 0px;

  & span {
    font-size: 14px;
    line-height: 24px;
  }
`



