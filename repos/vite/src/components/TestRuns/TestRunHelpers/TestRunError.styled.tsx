import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H5,
  cmx,
  Span,
  gutter,
  colors,
  getColor,
  WarningIcon,
} from '@gobletqa/components'

export const TestRunErrorContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
  height: 100%;
`


export const TestRunErrorHeaderContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${gutter.padding.dpx};
`

export const TestRunErrorContentContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${gutter.padding.dpx} 0px;
`

export const TestRunErrorHeaderText = styled(H5)(({ theme }) => `
  font-size: 18px;
  color: ${getColor(colors.gray15, colors.gray03, theme)};
`)

export const TestRunErrorTextContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white01, colors.black19), 30)};
`


export const TestRunErrorText = styled(Span)(({ theme }) => `
  font-size: 14px;
  font-weight: bold;
  margin-bottom: ${gutter.margin.qpx};
  color: ${getColor(colors.gray15, colors.gray03, theme)};
`)

export const TestRunErrorStack = styled(Span)(({ theme }) => `
  font-size: 12px;
  margin-top: 0px;
  margin-bottom: 0px;
  font-family: monospace;
  color: ${getColor(colors.gray18, colors.gray02, theme)};
`)

export const TestRunErrorIcon = styled(WarningIcon)`
  font-size: 22px;
  color: ${colors.error};
  margin-right: ${gutter.margin.hpx};
`
