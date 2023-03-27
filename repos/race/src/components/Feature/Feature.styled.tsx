import { Stack } from '../Section'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Unstable_Grid2'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { colors, gutter, dims, H3 } from '@gobletqa/components'

const { race } = dims

export const FeatureStack = styled(Stack)`
    padding: ${gutter.padding.px};
    padding-top: 0px;
    overflow-y: auto;
    scrollbar-width: none;
    background-color: var(--goblet-editor-background);

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar {
      width: 3px !important;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
`

export const FeatureContent = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const FeatureHeaderContainer = styled(Box)`
  top: 0;
  display: flex;
  position: sticky;
  align-items: center;
  margin-top: 0;
  z-index: ${race.header.zIdx};
  justify-content: space-between;
  margin-left: -${gutter.margin.px};
  margin-right: -${gutter.margin.px};
  margin-bottom: ${gutter.margin.hpx};
  min-height: ${race.header.height.px};
  max-height: ${race.header.height.px};
  background-color: var(--goblet-tab-activeBackground);
  border-bottom: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
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