
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { colors, gutter, BlockIcon, dims, H3, H4, Text, Span } from '@gobletqa/components'

export const DecoContainer = styled(Span)`
  display: flex;
`

const shared = `
  margin-right: ${gutter.margin.qpx};
`

export const DecoErrorContainer = styled(Span)`
  ${shared}
`

export const DecoFailContainer = styled(Span)`
  ${shared}
`

export const DecoPassContainer = styled(Span)`
  ${shared}
`

export const DecoSuccessContainer = styled(Span)`
  ${shared}
`

export const DecoSpinContainer = styled(Span)`
  ${shared}
`