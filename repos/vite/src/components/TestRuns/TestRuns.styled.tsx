import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H3,
  H5,
  dims,
  Text,
  gutter,
  Button,
  colors,
  getColor,
  WarningIcon,
  ModalFooter
} from '@gobletqa/components'


export const TestRunsContainer = styled(Box)(({ theme }) => `
  z-index: 1;
  height: 100%;
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  background-color: ${getColor(colors.white, colors.purple23, theme)};
  border-right: 1px solid ${getColor(colors.gray01, colors.black10, theme)};
`)

export const TestRunsHeader = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${gutter.padding.hpx} ${gutter.padding.px};
  padding-right: 0px;
`

export const TestRunsHeaderText = styled(H3)(({ theme }) => `
  color: ${getColor(colors.purple18, colors.purple01, theme)};
`)


export const TestRunsSectionsContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: start;
  height: ${dims.header.hpx};
  margin-left: ${gutter.margin.px};
  margin-right: ${gutter.margin.px};
  margin-bottom: ${gutter.margin.size * 1.3}px;
  border-bottom: 1px solid ${getColor(colors.white01, colors.gray15, theme)};
`)

export const TestRunsSection = styled(Box)`
  margin-right: ${gutter.margin.hpx};
`

export const TestRunsSectionBtn = styled(Button)(({ theme }) => `
  border-radius: 0px;
  height: ${dims.editor.tabs.px};
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
  border-bottom: 1px solid transparent;
  color: ${getColor(colors.gray05, colors.black06, theme)};
  transition: border-bottom ${dims.trans.avgEase}, color ${dims.trans.avgEase};

  &.active {
    border-bottom: 1px solid ${colors.purple10};
    color: ${getColor(colors.royalPurple, colors.purple02, theme)};
  }
`)

export const TestActionsFooter = styled(ModalFooter)(({ theme }) => `
  z-index: 30;
  flex-grow: 1;
  justify-content: space-between;
  max-height: ${dims.header.height * 2}px;
  background-color: ${getColor(colors.white, colors.purple23, theme)};
  padding: ${gutter.padding.px} ${gutter.padding.hpx} ${gutter.padding.hpx};
`)


export const TestRunReporterContainer = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-left: ${gutter.padding.px};
  padding-right: ${gutter.padding.px};
`

export const TestRunEventsContainer = styled(Box)``

export const NoTestRunActiveContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const NoTestRunActiveText = styled(H5)(({ theme }) => `
  font-size: 16px;
  color: ${getColor(colors.gray15, colors.gray03, theme)};
`)

export const NoTestRunActiveIcon = styled(WarningIcon)`
  color: ${colors.warn};
  margin-right: ${gutter.margin.hpx};
  font-size: 30px;
`

