import Box from '@mui/material/Box'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'

import { styled } from '@mui/material/styles'
import {
  H5,
  cmx,
  Span,
  gutter,
  dims,
  colors,
  getColor,
  IconButton,
  WarningIcon,
} from '@gobletqa/components'

const avgEase = dims.trans.avgEase
export const PastTestRunsListContainer = styled(Box)`
  padding: ${gutter.padding.dpx};
  padding-top: ${gutter.padding.px};
`
export const PastTestRunsListItems = styled(List)``
export const PastTestRunListItem = styled(ListItem)`
  padding-left: 0px;
  padding-right: 0px;
  padding-top: ${gutter.padding.px};
`
export const PastTestRunListItemText = styled(Box)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const PastTestRunListItemIcon = styled(ListItemIcon)`
 justify-content: flex-end;
`
export const PastTestRunListItemButton = styled(ListItemButton)`
  padding-left: 0px;
  padding-right: 0px;
  border-bottom: 1px solid;
  background-color: transparent;
  justify-content: space-between;
  transition: border-bottom-color ${avgEase}, color ${avgEase};
  border-bottom-color: ${cmx(getColor(colors.gray01, colors.black12), 30)};

  &:hover {
    color: ${colors.purple10};
    background-color: transparent;
    border-bottom-color: ${cmx(colors.purple10, 20)};
  }

`

export const PastTestRunListItemName = styled(Span)`
  
`
export const PastTestRunListItemDate = styled(Span)`
  
`

export const PastTestRunDecoContainer = styled(Box)`
  display: flex;
  align-items: center;
  max-width: 60px;
  margin-right: ${gutter.margin.hpx};
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
  }

  &.running {
    color: ${colors.purple10};
  }

`
