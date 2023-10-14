import Box from '@mui/material/Box'
import { Theme, styled } from '@mui/material/styles'

import {
  cmx,
  Input,
  Button,
  colors,
  gutter,
  getColor,
  BlockIcon,
  HelpOutlineIcon,
} from '@gobletqa/components'


export const JokerActionsContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${cmx(getColor(colors.white01, colors.black18, theme), 80)};
`)
