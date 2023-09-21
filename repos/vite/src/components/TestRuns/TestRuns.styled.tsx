import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H3,
  dims,
  Text,
  gutter,
  Button,
  colors,
  getColor,
  ModalFooter
} from '@gobletqa/components'


export const TestRunsContainer = styled(Box)(({ theme }) => `
  height: 100%;
  display: flex;
  flex-direction: column;
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


export const ExamSectionsContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: start;
  height: ${dims.header.hpx};
  margin-left: ${gutter.margin.px};
  margin-right: ${gutter.margin.px};
  margin-bottom: ${gutter.margin.size * 1.3}px;
  border-bottom: 1px solid ${getColor(colors.white01, colors.gray15, theme)};
`)

export const ExamSection = styled(Box)`
  margin-right: ${gutter.margin.hpx};
`

export const ExamSectionBtn = styled(Button)(({ theme }) => `
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



export const TestRunReporterContainer = styled(Box)``


export const NoTestRunActiveText = styled(Text)``
export const TestRunEventsContainer = styled(Box)``
export const NoTestRunActiveContainer = styled(Box)``

