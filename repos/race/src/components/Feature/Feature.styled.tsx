import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { styled } from '@mui/material/styles'
import { Text, gutter, colors, H3 } from '@gobletqa/components'

export const FeatureActionsContainer = styled(Box)`
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
`

export const HeaderText = styled(H3)`
  font-size: 16px;
  padding-left: 12px;
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