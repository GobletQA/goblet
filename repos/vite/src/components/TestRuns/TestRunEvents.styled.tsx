import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import {
  DecoPass,
  DecoFail,
  DecoSpin,
  DecoError,
  DecoSuccess,
} from '@gobletqa/race'


import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H4,
  H3,
  Span,
  dims,
  Text,
  Input,
  gutter,
  Button,
  colors,
  getColor,
  AutoInput,
  GobletIcon,
} from '@gobletqa/components'



export const TestRunEventsContainer = styled(Box)`
  width: 100%;
`
export const TestRunEventsDropdown = styled(Collapse)``

export const TestRunEventsList = styled(List)`
  width: 100%;
`
export const TestRunEventsListHeader = styled(ListSubheader)`
  display: flex;
  cursor: pointer;
  align-items: center;
  color: ${colors.royalPurple};
  transition: color ${dims.trans.avgEase};

  &:hover {
    color: ${colors.purple12};
  }
`

export const TestRunEventItem = styled(ListItem)`
  margin-left: ${gutter.margin.hpx};
`
export const TestRunEventContainer = styled(Box)``
export const TestRunEventText = styled(ListItemText)``
export const TestRunEventIconContainer = styled(ListItemIcon)``


export const TestRunDecoContainer = styled(Box)``
export const TestRunDecoPass = styled(DecoPass)`
  padding-right: ${gutter.padding.hpx};
`
export const TestRunDecoFail = styled(DecoFail)``
export const TestRunDecoSpin = styled(DecoSpin)``
export const TestRunDecoError = styled(DecoError)``
