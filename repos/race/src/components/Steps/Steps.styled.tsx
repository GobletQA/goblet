import type { TGobletTheme } from '@gobletqa/components'
import type { ComponentProps, ComponentType } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Unstable_Grid2'

import { styled } from '@mui/material/styles'

export const StepContainer = styled(Card)`
  margin-top: 10px;
`
export const StepContent = styled(CardContent)`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center:
`
export const StepHeader = styled(CardHeader)``
export const StepActions = styled(CardActions)``
export const StepGrid = styled(Grid)``
export const StepGridItem = styled(Grid)``