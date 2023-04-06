import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Text, GobletIcon, getColor, gutter, colors } from '@gobletqa/components'

export const Container = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding-top: ${gutter.padding.dpx};
  padding-bottom: ${gutter.padding.dpx};
` 
export const LogoContainer = styled(Box)`
  padding-top: ${gutter.padding.px};
  padding-bottom: ${gutter.padding.px};

  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid ${colors.white01};
`
export const LogoIcon = styled(GobletIcon)`
  height: 100px;
  width: 100px;
`
export const LogoText = styled(Text)(({ theme }) => `
  margin-top: 0px;
  font-size: 25px;
  color: ${getColor(`colors.royalPurple`, `colors.white`, theme)}
`)

export const SubText = styled(Text)(({ theme }) => `
  font-size: 14px;
  color: ${getColor(`colors.gray20`, `colors.gray07`, theme)}
`)
