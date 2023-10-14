import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import {
  H4,
  cmx,
  Button,
  colors,
  gutter,
  getColor,
} from '@gobletqa/components'


export const JokerActionsContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${cmx(getColor(colors.white01, colors.black18, theme), 80)};
`)

export const JokerActionsContent = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  flex-direction: column;
`)

export const JokerActionsHeader = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
`)

export const JokerActionsHeaderText = styled(H4)(({ theme }) => `
`)



export const JokerActionsList = styled(Box)(({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`)

export const JokerActionContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white, colors.black20, theme), 80)};
`)


export const JokerActionBtn = styled(Button)(({ theme }) => `
  
`)



export const JokerActiveActionContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white, colors.black20, theme), 80)};
`)