import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Unstable_Grid2'
import CardContent from '@mui/material/CardContent'
import { Span, gutter } from '@gobletqa/components'

import { styled } from '@mui/material/styles'

export const StepContainer = styled(Card)`
  width: 100%;
  margin-top: ${gutter.margin.px};
`
export const StepContent = styled(CardContent)`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0px;
  padding-top: ${gutter.padding.px};

  &:last-child {
    padding-bottom: 0px;
  }
`

export const StepHeaderText = styled(Span)`
  font-size: 14px;
  padding: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
  color: var(--goblet-editor-foreground);
`

export const StepGrid = styled(Grid)``
export const StepGridItem = styled(Grid)``

export const ActionInfoText = styled(Span)`
  width: 100%;
  font-size: 12px;
  padding-top: 2px;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden !important;
`

export const EmptyItem = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: 0px !important;
`

