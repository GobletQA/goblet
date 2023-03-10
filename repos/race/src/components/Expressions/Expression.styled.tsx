import { Span, gutter } from '@gobletqa/components'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'

export const ExpGridItem = styled(Grid)``

export const ExpressionInfoText = styled(Span)`
  width: 100%;
  font-size: 12px;
  padding-top: 2px;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
`