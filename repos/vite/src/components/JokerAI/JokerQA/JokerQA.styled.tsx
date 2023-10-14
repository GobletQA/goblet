import Box from '@mui/material/Box'
import { Theme, styled } from '@mui/material/styles'

import {
  cmx,
  Input,
  Button,
  colors,
  gutter,
  getColor,
  BlockIcon,
  scrollbarStyle,
  HelpOutlineIcon,
} from '@gobletqa/components'

export const JokerQAContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${cmx(getColor(colors.white01, colors.black18, theme), 80)};
`)

export const JokerMessagesContainer = styled(Box)(({ theme }) => `
  flex: 1;
  width: 100%;
  margin: 0px;
  padding: 0px;
  height: 100%;
  display: flex;
  overflow-y: auto;
  ${scrollbarStyle(theme)}
`)

export const JokerMessages = styled(Box)(({ theme }) => `
  flex-grow: 2;
  display: flex;
  padding: 0px ${gutter.padding.px};
`)

export const JokerMessagesList = styled(Box)(({ theme }) => `
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${gutter.padding.hpx};
  background-color: ${getColor(colors.white, colors.black18, theme)};
  border: 1px solid ${getColor(colors.gray01, colors.black16, theme)};
  border-top-width: 0px;
`)

export const JokerQContainer = styled(Box)(({ theme }) => `
  flex-shrink: 1;
  width: 100%;
  display: flex;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white01, colors.black18, theme), 80)};
`)

export const JokerQInputContainer = styled(Box)`
  flex: 1;
  width: 100%;
`

export const JokerQInput = styled(Input)(({ theme }) => `
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

export const JokerQSubmitContainer = styled(Box)`
  margin-left: ${gutter.margin.hpx};
`
export const JokerQSubmit = styled(Button)``

export const JokerQSubIcon = styled(HelpOutlineIcon)``

export const JokerQCancelIcon = styled(BlockIcon)``
