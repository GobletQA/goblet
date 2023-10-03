import type { ElementType } from 'react'
import type { ListProps, ListItemButtonProps } from '@mui/material'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import {
  cmx,
  dims,
  Span,
  gutter,
  colors,
  getColor,
} from '@gobletqa/components'

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
      width: 22px;
      height: 22px;
      color: var(--goblet-list-inactiveSelectionForeground);
    }
  }

  & .MuiAccordionSummary-content {
    margin:  0px;
  }
  
  & > .gb-dropdown > .gb-dropdown-header:hover {
    ${shared}

    & .feature-group-header-actions {
      opacity: 1;
      background-color: var(--goblet-list-hoverBackground);
    }

    & .gb-dropdown-expand-icon {
      width: 22px;
      height: 22px;
      color: var(--goblet-list-hoverForeground);
    }
  }

`

export const FeaturesGroupContainer = styled(Box)<TListFeatures>`
  padding-left: 10px;
`

// Files Actions only
export const FeatureItem = styled(ListItemButton)<TFeatureItem>`
  height: 30px;
  padding: 0px;
  color: var(--goblet-list-inactiveSelectionForeground);

  &:hover {
    ${shared}
  }

  &.active {
    ${shared}
  }

  & .gb-feature-item-action-container {
    opacity: 0;
    transition: opacity ${dims.trans.avgEase}, background-color ${dims.trans.halfAvg};
  }

  &:hover .gb-feature-item-action-container {
    opacity: 1;
    background-color: var(--goblet-list-hoverBackground);
  }

`

export const FeatureItemName = styled(ListItemText)`
  margin: 0px;
  white-space: nowrap;
  margin-left: ${gutter.margin.hpx};

  &.gb-feature-title-missing {
    border: 1px solid #E83333;
    width: 100%;
    height: 100%;
  }
`

export const FeatureItemActionsContainer = styled(Span)(({ theme }) => {
  const bgClr = getColor(colors.white, colors.purple23, theme)
  const textClr = getColor(colors.purple23, colors.white, theme)

  return `
    right: 0px;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    padding-left: ${gutter.padding.qpx};
    background-color: ${cmx(bgClr, 95)};
    transition: background-color ${dims.trans.halfAvg};

    & .gb-race-feature-item-icon {
      pointer-events: initial;
      margin-right:${gutter.margin.qpx};
      transition: color ${dims.trans.avgEase};
      color: var(--goblet-sideBarSectionHeader-foreground);
      
      &:hover {
        color: ${textClr} !important;
      }
    }
  `
})

export const FeatureGroupHeaderEdit = styled(Box)`
  width: 99%;
  height: 100%;
  padding-left: ${gutter.padding.qpx};

  &[contenteditable=true]:empty:before {
    display: block;
    pointer-events: none;
    content: attr(placeholder);
  }
`

export const FeatureGroupHeaderActions = styled(Span)(({ theme }) => {
  const bgClr = getColor(colors.white, colors.purple23, theme)
  const textClr = getColor(colors.purple23, colors.white, theme)

  // Folder Actions only
  return `
    right: 0px;
    opacity: 0;
    height: 25px;
    padding-top: 3px;
    padding-left: 5px;
    position: absolute;
    background-color: ${cmx(bgClr, 95)};
    transition: color ${dims.trans.avgEase}, background-color ${dims.trans.halfAvg};

    & .gb-race-group-header-action {
      margin-right: 5px;
      transition: color ${dims.trans.avgEase};
      color: var(--goblet-sideBarSectionHeader-foreground);

      &:hover {
        color: ${textClr} !important;
      }
    }

  `
})