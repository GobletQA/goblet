import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import { Toggle } from '@gobletqa/components/components/Form/Inputs'
import {
  H4,
  cmx,
  Span,
  Input,
  dims,
  gutter,
  InText,
  colors,
  getColor,
  AutoInput,
  ExpandIcon,
} from '@gobletqa/components'

const avgEase = dims.trans.avgEase

export const RunTestOptsContainer = styled(Box)`
  height: 100%;
  padding: ${gutter.padding.px};
  padding-top: 0px;
`

export const RunTestOptsSectionContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
`

export const RunTestOptsSectionDrawer = styled(Collapse)(({ theme }) => `
  padding: ${gutter.padding.qpx} ${gutter.padding.dpx} ${gutter.padding.hpx};
  background-color: ${cmx(getColor(colors.white01, colors.black19, theme), 10)};
`)

export const OptionsContainer = styled(Box)``

export const TestOptsHeaderContainer = styled(Box)`
  cursor: pointer;
`
export const TestOptsHeaderTitle = styled(H4)(({ theme }) => `
  display: flex;
  font-size: 0.94rem;
  align-items: center;
  
  padding-bottom: 8px;
  border-bottom: 1px solid;
  border-bottom-color: ${cmx(getColor(colors.gray01, colors.black12, theme), 30)};
  color: ${getColor(colors.gray18, colors.gray01, theme)};
  transition: border-bottom-color ${avgEase}, color ${avgEase};

  &:hover {
    color: ${cmx(getColor(colors.purple11, colors.gray01, theme), 90)};
    border-bottom-color: ${cmx(getColor(colors.purple06, colors.gray01, theme), 20)};
  }

  &.open {

  }
`)

export const TestOptsHeaderText = styled(InText)``

export const RunTestOptsExpandIcon = styled(ExpandIcon)`
  left: -5px;
  position: relative;
  margin-right: ${gutter.margin.qpx};
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


