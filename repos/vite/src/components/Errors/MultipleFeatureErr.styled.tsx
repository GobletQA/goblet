import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  gutter,
  colors,
  getColor,
} from '@gobletqa/components'


export const ErrorContainer = styled(Box)(({ theme }) => {
  return `
    margin-top: ${gutter.margin.px};
    padding: 0px ${gutter.padding.hpx};
    
    & .gb-error-msg-solution-container {
      margin-bottom: ${gutter.margin.px};
    }
  `
})


export const ErrorMsgContainer = styled(Box)(({ theme }) => {
  return `
    display: flex;
    flex-direction: column;
    margin-bottom: ${gutter.margin.dpx};
  `
})


export const ErrorTitle = styled(Text)(({ theme }) => {
  return `
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    margin-bottom: ${gutter.margin.hpx};
  `
})


export const ErrorProblemContainer = styled(Box)(({ theme }) => {
  
  return `
    width: 100%;
    border-radius: 5px;
    padding: ${gutter.padding.px};
    margin-top: ${gutter.margin.qpx};
    background-color: ${getColor(colors.red01, colors.red20, theme)}
  `
})


export const ErrorFixContainer = styled(Box)(({ theme }) => {
  
  return `
    width: 100%;
    border-radius: 5px;
    padding: ${gutter.padding.px};
    margin-top: ${gutter.margin.qpx};
    background-color: ${getColor(colors.green01, colors.green20, theme)}
  `
})


export const ErrorItemsContainer = styled(Box)(({ theme }) => {
  
  return ``
})


export const ErrorItem = styled(Text)(({ theme }) => {
  
  return `
    font-size: 14px;
    margin-left: ${gutter.margin.qpx};
  `
})