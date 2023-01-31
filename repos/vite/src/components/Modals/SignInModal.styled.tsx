import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Text, GobletIcon, getColor } from '@gobletqa/components'

export const Container = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
` 
export const LogoContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`
export const LogoIcon = styled(GobletIcon)`
  height: 70px;
  width: 70px;
`
export const LogoText = styled(Text)(({ theme }) => `
  margin-top: 0px;
  font-size: 20px;
  color: ${getColor(`colors.royalPurple`, `colors.white`, theme)}
`)
