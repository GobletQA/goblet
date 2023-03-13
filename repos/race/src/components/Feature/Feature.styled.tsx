import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Unstable_Grid2'


import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { styled } from '@mui/material/styles'
import { gutter, colors, H3 } from '@gobletqa/components'

export const FeatureHeaderContainer = styled(Box)`
  top: 0;
  z-index: 1;
  display: flex;
  position: sticky;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: -${gutter.margin.px};
  margin-right: -${gutter.margin.px};
  background-color: var(--goblet-editor-background);
  border-bottom: 2px solid var(--goblet-list-focusBackground);
  min-height: 40px;
  max-height: 40px;
`

export const FeatureActionsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`
export const FeatureActionBtn = styled(Button)`
  padding: 4px 8px;
  width: auto;
  min-width: initial;
  border-radius: 0px;
  border-left: 1px solid var(--goblet-sideBar-border);
  
  &:first-of-type {
    border-left: none;
  }
  
  > span {
    margin-left: auto;
    margin-right: auto;
  }

  & .MuiButton-startIcon {
    margin-right: ${gutter.margin.qpx};
  }
`


export const HeaderText = styled(H3)`
  flex-grow: 1;
  font-size: 16px;
  padding-left: 20px;
`

export const EmptyFeatureGrid = styled(Grid)``

export const EmptyList = styled(List)`
  padding-left: 0px;
  padding-right: 0px;
`
export const EmptyItem = styled(ListItem)`
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;

  padding-left: 0px;
  padding-right: 0px;
`


export const EmptyItemIcon = styled(ListItemIcon)``
export const EmptyItemText = styled(ListItemText)``
export const EmptyItemTextContainer = styled(Box)`
  padding-left: 20px;
  padding-right: 20px;
`

export const FeatureInfoTextContainer = styled(Box)``
export const FeatureInfoGrid = styled(Grid)``
export const FeatureInfoGridLeft = styled(Grid)``
export const FeatureInfoGridRight = styled(Grid)``