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
  dims,
  Span,
  gutter,
  colors,
  InText,
  getColor,
} from '@gobletqa/components'


export const TestRunReporterContainer = styled(Box)(({ theme }) => `
  height: 100%;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};

  overflow-x: hidden;
  scrollbar-width: none;
  padding: 0px ${gutter.padding.hpx};
  scrollbar-gutter: stable both-edges;

  ::-webkit-scrollbar-track {
      background: ${getColor(colors.white, colors.purple23, theme)};
      box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
      -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: ${getColor(colors.gray03, `${colors.purple13}66`, theme)};
    box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
    -webkit-box-shadow: inset 0 0 5px ${getColor(`${colors.gray07}00`, `#${colors.purple19}00`, theme)};
  }

`)

export const TestRunEventsContainer = styled(Box)`
  width: 100%;
`
export const TestRunEventsDropdown = styled(Collapse)``

export const TestRunEventsList = styled(List)`
  width: 100%;
`

export const TestRunEventsListHeaderContainer = styled(Span)(({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
  padding-right: ${gutter.padding.hpx};
  padding-bottom: ${gutter.padding.qpx};
`)

export const TestRunEventsListHeader = styled(ListSubheader)(({ theme }) => `
  display: flex;
  cursor: pointer;
  align-items: center;
  color: ${colors.royalPurple};
  transition: color ${dims.trans.avgEase};
  background-color: ${getColor(colors.white, colors.purple23, theme)};

  &:hover {
    color: ${colors.purple12};
  }
`)

export const TestRunListHeaderText = styled(InText)``

export const TestRunEventItem = styled(ListItem)`
  margin-left: ${gutter.margin.hpx};
`
export const TestRunEventContainer = styled(Box)``
export const TestRunEventText = styled(ListItemText)``
export const TestRunEventIconContainer = styled(ListItemIcon)``


export const TestRunDecoContainer = styled(Box)`
  padding-right: ${gutter.padding.hpx};
`
export const TestRunDecoPass = styled(DecoPass)``
export const TestRunDecoFail = styled(DecoFail)``
export const TestRunDecoSpin = styled(DecoSpin)``
export const TestRunDecoError = styled(DecoError)``
