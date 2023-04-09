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
    padding: 0px ${gutter.padding.hpx};
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    
    // background - #f9f8fb / dots - gray01
    background: linear-gradient(90deg, var(--goblet-editorGroup-background) 23px, transparent 1%) center, linear-gradient(var(--goblet-editorGroup-background) 23px, transparent 1%) center, var(--goblet-editor-border);
    background-size: 25px 25px;
    scrollbar-gutter: stable both-edges;


    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar {
      width: 0px !important;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    
    & > .gb-section-stack-content {
      height: auto;
      padding-bottom: 100px;
    }
`

export const FeatureContent = styled(Box)`
  width: 100%;
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
  min-height: ${race.header.height.px};
  max-height: ${race.header.height.px};
  background-color: var(--goblet-tab-activeBackground);
  border-bottom: 1px solid var(--goblet-editorGroupHeader-tabsBorder);
`

export const FeatureMenuContainer = styled(Box)`
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

  color: ${colors.gray08};
  transition: color 300ms ease;
  
  &:hover {
    color: ${colors.purple10};
  }

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
  font-size: 18px;
  padding-left: 20px;
  color: var(--goblet-editor-foreground);
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