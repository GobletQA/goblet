import type { CSSProperties } from 'react'
import type { Theme } from '@mui/material/styles'

import Box from '@mui/material/Box'

import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import {
  dims,
  colors,
  getColor,
  IconButton
} from '@gobletqa/components'


export const JokerAIContainer = styled(Box)`
  height: 100%;
  background-color: ${getColor(colors.white, colors.black19)};
  
  & .MuiPaper-root {
    background-color: ${getColor(colors.white, colors.black19)};
  }
`