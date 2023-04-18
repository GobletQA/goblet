import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { colors, gutter, Span, H4, WarningIcon } from '@gobletqa/components'

export const ExpGridItem = styled(Grid)``

export const NoExpHeaderContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${gutter.margin.hpx};
`

export const NoExpIcon = styled(WarningIcon)`
  margin-right: ${gutter.margin.hpx};
  color: ${colors.error};
`


export const NoExpGridItem = styled(Grid)`
  min-width: 100%;
  margin: 10px 0px;
  text-align: center;
`

export const NoExpHeader = styled(H4)`
  color: ${colors.red18};
`


export const ExpressionInfoText = styled(Span)`
  width: 100%;
  font-size: 12px;
  padding-top: 2px;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
`