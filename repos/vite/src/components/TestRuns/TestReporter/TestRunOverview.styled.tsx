import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H4,
  gutter,
  colors,
  getColor,
} from '@gobletqa/components'

export const TestRunOverviewContainer = styled(Box)`
  margin-top: 0px;
  margin-bottom: ${gutter.margin.dpx};
`

export const TestRunOverviewSections = styled(Box)`
  display: flex;
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
`

export const TestRunOverviewSection = styled(Box)(({ theme }) => {
  return `
    flex: 1;
    padding: ${gutter.padding.hpx};
    margin-right: ${gutter.margin.px};
    background-color: ${getColor(colors.white00, colors.black13, theme)};
  `
})

export const TestRunOverviewSectionTitle = styled(H4)`
  margin: 0px;
  font-size: 14px;
  margin-bottom: ${gutter.margin.hpx};
`

export const TestRunOverviewText = styled(Box)`
  font-size: 12px;
  padding: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
  margin-left: ${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.qpx};

  &.failed {
    color: ${colors.red10};
    font-weight: bold;
    border-left: 5px solid ${colors.red10};
  }

  &.passed {
    color: ${colors.shinyShamrock};
    border-left: 5px solid ${colors.shinyShamrock};
  }

  &.skipped {
    color: ${colors.yellow12};
    border-left: 5px solid ${colors.yellow12};
  }

`


