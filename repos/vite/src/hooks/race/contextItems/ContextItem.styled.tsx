import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { Label, Span, getColor, gutter, colors } from '@gobletqa/components'

export const ContextItemContainer = styled(Box)`
  width: 100%;
  cursor: pointer;
`
export const ContextItemKey = styled(Span)`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${colors.purple12};
`
export const ContextItemBreak = styled(Span)`
  cursor: pointer;
  margin: 0px ${gutter.margin.qpx};
`

export const ContextItemValWrap = styled(Span)`
  cursor: pointer;
`


export const ContextItemVal = styled(Label)`
  font-size: 12px;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${getColor(colors.gray20, colors.gray03)};
`
