
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H4,
  H3,
  Span,
  dims,
  Input,
  gutter,
  Button,
  colors,
  getColor,
  AutoInput,
  GobletIcon,
  ModalFooter
} from '@gobletqa/components'
import { Toggle } from '@gobletqa/components/components/Form/Inputs'


export const ExamRunContainer = styled(Box)(({ theme }) => `
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${getColor(colors.gray01, colors.black10, theme)};
`)

export const ExamRunHeader = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${gutter.padding.hpx} ${gutter.padding.px};
  padding-right: 0px;
`

export const ExamRunHeaderText = styled(H3)(({ theme }) => `
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


export const ExamCfgContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
`

export const OptionsContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
`

export const TestOptsHeaderContainer = styled(Box)`
  margin-top: ${gutter.margin.hpx};
`
export const TestOptsHeaderTitle = styled(H4)``

export const TestActionsFooter = styled(ModalFooter)`
  padding: ${gutter.padding.px} ${gutter.padding.hpx} ${gutter.padding.hpx};
  justify-content: space-between;
`

export const TestOptsContainer = styled(Box)``
export const InputContainer = styled(Box)`
  margin-top: ${gutter.margin.px};
  margin-bottom: ${gutter.margin.px};
`
export const TagsInput = styled(AutoInput)``
export const InputHelperText = styled(Span)`
  font-size: 12px;
`

export const NumberInput = styled(Input)``

export const ToggleInput = styled(Toggle)`
  & button {
    height: 30px;
  }
`



