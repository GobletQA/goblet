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
  Text,
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

  padding: 0px;
  overflow-x: hidden;
  scrollbar-width: none;
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

export const TestRunFileContainer = styled(Box)`
  width: 100%;
`
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
  padding-left: ${gutter.padding.size * 1}px;
  &.scenario {
    padding-left: ${gutter.padding.size * 2}px;
  }
  &.rule {
    padding-left: ${gutter.padding.size * 2}px;
  }
  &.background {
    padding-left: ${gutter.padding.size * 2}px;
  }
  &.test {
    padding-left: ${gutter.padding.size * 3}px;
  }
`
export const TestRunEventContainer = styled(Box)`
  display: flex;
`
export const TestRunEventTextContainer = styled(ListItemText)`
  & .gb-test-run-event-type {
    &.feature {
      color: ${colors.royalPurple};
    }
    &.scenario {
      color: ${colors.lightEditor.blueGreen};
    }
    &.rule {
      color: ${colors.lightEditor.blueGreen};
    }
    &.background {
      color: ${colors.lightEditor.blueGreen};
    }
    &.test {
      color: ${colors.gray10};
    }
  }

`

export const TestRunEventIconContainer = styled(ListItemIcon)`
  min-width: 25px;
  max-width: 25px;
`


export const TestRunDecoContainer = styled(Box)`
  width: 25px;
  height: 25px;

  &.gb-test-run-file-deco {
    padding-right: ${gutter.padding.hpx};
  }
  
`
export const TestRunDecoPass = styled(DecoPass)``
export const TestRunDecoFail = styled(DecoFail)``
export const TestRunDecoSpin = styled(DecoSpin)``
export const TestRunDecoError = styled(DecoError)``

const shared = `
  font-size: 14px;
  font-weight: bold;
  margin-left: ${gutter.margin.hpx};
  margin-right: ${gutter.margin.qpx};
`

export const TestRunTypeEvtType = styled(Span)`
  ${shared}
`
export const TestRunFeatureEvtType = styled(Span)`
  ${shared}
`
export const TestRunParentEvtType = styled(Span)`
  ${shared}
`
export const TestRunStepEvtType = styled(Span)`
  ${shared}
`

export const TestRunEvtText = styled(Span)`
  font-size: 14px;
  color: ${getColor(colors.gray19, colors.gray02)};
`