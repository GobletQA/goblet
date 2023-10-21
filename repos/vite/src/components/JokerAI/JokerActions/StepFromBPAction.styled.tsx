import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  gutter,
  InText,
  Input,
  colors,
  Button,
  getColor,
  SendIcon,
  BlockIcon,
} from '@gobletqa/components'



export const FormContainer = styled(Box)`
  width: 100%;
  padding: 0px ${gutter.padding.px};
`
export const InputContainer = styled(Box)`
  margin-bottom: ${gutter.margin.px};
  
  &.align-right {
    text-align: right;
  }
`

export const InputHelperText = styled(InText)`
  text-wrap: balance;
  word-break: break-all;
  overflow-wrap: break-word;
`

export const InputPrompt = styled(Input)(({ theme }) => `
  & .MuiInputBase-root {
    padding: 0px;
  }

  & textarea {
    line-height: 20px;
    padding: ${gutter.padding.hpx};
    color: ${getColor(colors.black09, colors.white, theme)};
    background-color: ${getColor(colors.white, colors.black19, theme)};
  }
  
  & .MuiFormHelperText-root {
    display: none;
  }
`)


export const SubmitBtn = styled(Button)`
`
export const SubmitIcon = styled(SendIcon)`
  height: 16px;
  width: 16px;
`
export const CancelIcon = styled(BlockIcon)``