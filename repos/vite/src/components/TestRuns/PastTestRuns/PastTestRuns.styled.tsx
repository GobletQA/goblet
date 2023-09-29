import Box from '@mui/material/Box'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'

import { styled } from '@mui/material/styles'
import {
  cmx,
  dims,
  Span,
  colors,
  gutter,
  InText,
  getColor,
} from '@gobletqa/components'

const avgEase = dims.trans.avgEase
export const PastTestRunsListContainer = styled(Box)`
  padding: ${gutter.padding.dpx};
  padding-top: 0px;
`

export const PastTestRunsListItems = styled(List)`
  padding-top: 0px;
  background-color: ${cmx(getColor(colors.white01, colors.black19), 10)};
`

export const PastTestRunListItem = styled(ListItem)`
  width: 100%;
  padding: ${gutter.padding.px};
  padding-bottom: 0px;

  &.header {
    padding-top: 0px;
  }
`
export const PastTestRunListItemContent = styled(Box)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.header {
    line-height: 35px;
    color: ${getColor(colors.gray18, colors.gray01)};
  }
  
`
export const PastTestRunListItemIcon = styled(ListItemIcon)`
  max-width: 55px;
  justify-content: flex-end;
`

export const PastTestRunListItemHeader = styled(ListSubheader)`
  flex-grow: 1;
  display: flex;
  border-bottom: 1px solid;
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
  border-bottom-color: ${cmx(getColor(colors.gray03, colors.black10), 30)};
`

export const PastTestRunListItemButton = styled(ListItemButton)`
  padding-left: 0px;
  padding-right: 0px;
  border-bottom: 1px solid;
  background-color: transparent;
  transition: border-bottom-color ${avgEase}, color ${avgEase};
  border-bottom-color: ${cmx(getColor(colors.gray01, colors.black12), 30)};

  &:hover {

    color: ${colors.purple10};
    background-color: transparent;
    border-bottom-color: ${cmx(colors.purple10, 20)};

    &.passed {
      color: ${colors.shinyShamrock};
      border-bottom-color: ${cmx(colors.shinyShamrock, 20)};
    }

    &.failed {
      color: ${colors.red10};
      border-bottom-color: ${cmx(colors.red10, 20)};
    }

    &.canceled {
      color: ${colors.yellow12};
      border-bottom-color: ${cmx(colors.yellow12, 20)};
    }

    svg {
      &.passed {
        color: ${colors.shinyShamrock};
      }

      &.failed {
        color: ${colors.red10};
      }

      &.canceled {
        color: ${colors.yellow12};
      }
    }
  }

  }
`

export const PastTestRunListItemText = styled(InText)`
  width: 30%;
  max-width: 30%;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: ${gutter.padding.px};
  
  &.header {
    font-weight: bold;
    font-size: 0.94rem;
  }
  
  &.header.status {
    padding-right: 0px;
    overflow: initial;
    white-space: initial;
  }

  &.date {
    width: 40%;
    max-width: 40%;
  }
  
`

export const PastTestRunDecoContainer = styled(Box)`
  flex: 1;
  display: flex;
  align-items: center;
  width: 30%;
  max-width: 30%;
`

export const PastTestRunStatusText = styled(Span)`
  font-size: 12px;
  font-weight: bold;
  margin-left: ${gutter.margin.qpx};

  &.passed {
    color: ${colors.shinyShamrock};
  }

  &.failed {
    color: ${colors.red10};
  }

  &.canceled {
    color: ${colors.yellow12};
    margin-left: ${gutter.margin.size / 3}px;
  }

  &.running {
    color: ${colors.purple10};
  }

`
