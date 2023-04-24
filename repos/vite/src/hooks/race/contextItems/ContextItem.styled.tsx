import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Text, Label, PurpleText, GreenText, Span, getColor, gutter, colors } from '@gobletqa/components'

export const ContextItemContainer = styled(Box)`
  width: 100%;
`
export const ContextItemKey = styled(Span)`
  font-weight: bold;
  letter-spacing: 0.2px;
  font-size: 14px;
  color: ${colors.purple12};
`
export const ContextItemBreak = styled(Span)`
  margin: 0px ${gutter.margin.qpx};
`

export const ContextItemValWrap = styled(Span)``


export const ContextItemVal = styled(Label)`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${getColor(colors.gray20, colors.gray03)};
`
