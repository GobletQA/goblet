import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  colors,
  getColor,
} from '@gobletqa/components'


export const JokerAIContainer = styled(Box)`
  height: 100%;
  background-color: ${getColor(colors.white, colors.black19)};
  
  & .MuiPaper-root {
    background-color: ${getColor(colors.white, colors.black19)};
  }
`