import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Unstable_Grid2'
import CardContent from '@mui/material/CardContent'
import { Span, gutter } from '@gobletqa/components'

import { styled } from '@mui/material/styles'

export const StepContainer = styled(Card)`
  margin-top: 10px;
`
export const StepContent = styled(CardContent)`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  padding: ${gutter.padding.px};
  padding-top: ${gutter.padding.hpx};
  padding-bottom: ${gutter.padding.qpx};

  &:last-child {
    padding-bottom: ${gutter.padding.qpx};
  }
`
export const StepCardHeader = styled(Box)`
  width: 100%;
  height: 32px;
  display: flex;
  position: relative;
  align-items: center;
  padding-bottom: ${gutter.padding.qpx};
  background-color: var(--goblet-list-focusBackground);
`
export const StepActionsContainer = styled(Box)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 4px;
`

export const StepHeaderText = styled(Span)`
  font-size: 12px;
  padding: ${gutter.padding.qpx};
  padding-left: ${gutter.padding.hpx};
  color: var(--goblet-editor-foreground);
`


export const StepGrid = styled(Grid)``
export const StepGridItem = styled(Grid)``