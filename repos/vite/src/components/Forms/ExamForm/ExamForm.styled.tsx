
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H4,
  Span,
  gutter,
  Input,
  AutoInput,
  ModalFooter
} from '@gobletqa/components'
import { Toggle } from '@gobletqa/components/components/Form/Inputs'

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



