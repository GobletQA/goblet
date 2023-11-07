import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import {
  H4,
  dims,
  Span,
  cmx,
  gutter,
  colors,
  InText,
  getColor,
  LockIcon,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'
import {
  DecoPass,
  DecoFail,
  DecoSpin,
  DecoError,
  DecoCanceled,
} from '@gobletqa/race'

export const TestRunLoadingContainer = styled(Box)`
  flex: 1;
  width: 100%;
  display: flex;
  min-height: 50%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${gutter.padding.dpx};
`

export const TestRunSectionHeader = styled(Box)`
  margin-bottom: ${gutter.margin.px};
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
`

export const TestRunSectionHeaderTitle = styled(H4)(({ theme }) => `
  padding-bottom: 8px;
  border-bottom: 1px solid;
  color: ${getColor(colors.gray18, colors.gray01, theme)};
  border-bottom-color: ${cmx(getColor(colors.gray03, colors.black10, theme), 30)};
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
  flex-wrap: wrap;
  padding-left: ${gutter.padding.px};

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
  align-items: flex-start;
  padding-left: ${gutter.padding.hpx};

  &.gb-evt-state-canceled.gb-run-state-canceled {
    opacity: 0.7;
  }

  &.gb-evt-state-passed.gb-run-state-failed {
    opacity: 0.7;
  }

  &.feature {
    padding-left: ${gutter.padding.qpx};
  }

  &.test {
    padding-left: ${gutter.padding.tQpx};
  }

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

export const TestRunEventTextContainer = styled(ListItemText)`
  margin: 0px;
`

export const TestRunEventIconContainer = styled(ListItemIcon)`
  min-width: 20px;
  max-width: 20px;
`

export const TestRunDecoContainer = styled(Box)`
  width: 20px;
  height: 25px;
  display: flex;
  align-items: center;

  &.gb-test-run-file-deco {
    margin-right: ${gutter.margin.hpx};
  }

  &.gb-test-run-event-deco {
    & svg.gb-deco-icon {
      top: -3px;
    }
    & svg.gb-deco-icon.gb-deco-icon-pass {
      top: -6px;
    }
    & .gb-deco-icon.gb-deco-icon-spin {
      top: -3px;
      position: relative;
    }

    & svg.gb-deco-icon.gb-deco-icon-canceled {
      top: -4px;
    }

  }

  & .gb-deco-icon.gb-deco-icon-spin {
    position: initial;
  }

  & svg.gb-deco-icon.gb-deco-icon-canceled {
    width: 16px;
    height: 16px;
    left: 3px;
  }

  & svg.gb-deco-icon {
    width: 20px;
    height: 20px;
    position: relative;
  }

`
export const TestRunDecoPass = styled(DecoPass)``
export const TestRunDecoFail = styled(DecoFail)``
export const TestRunDecoSpin = styled(DecoSpin)``
export const TestRunDecoError = styled(DecoError)``
export const TestRunDecoCanceled = styled(DecoCanceled)``

export const TestRunTypeEvtType = styled(Box)`
  font-size: 14px;
  font-weight: bold;
  margin-left: ${gutter.margin.hpx};
  margin-right: ${gutter.margin.qpx};
`

export const TestRunEvtText = styled(Span)(({ theme }) => `
  font-size: 14px;
  color: ${getColor(colors.gray19, colors.gray02, theme)};
`)

export const TestRunEvtErrContainer = styled(Box)`
  margin-top: ${gutter.margin.px};
  margin-left: ${gutter.margin.dpx};
`

export const TestRunEvtErrTitle = styled(Box)`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.error};
  margin-bottom: ${gutter.margin.hpx};
`

export const TestRunEvtErrText = styled(Box)(({ theme }) => `
  font-size: 12px;
  margin-left: ${gutter.margin.px};
  color: ${getColor(colors.gray19, colors.gray02, theme)};
`)
