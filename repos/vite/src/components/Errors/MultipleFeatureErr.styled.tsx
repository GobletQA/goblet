import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  gutter,
  colors,
  RedText,
  getColor,
  CheckIcon,
  CancelIcon,
} from '@gobletqa/components'


export const ErrorContainer = styled(Box)(({ theme }) => {
  
  return `
    padding: 0px ${gutter.padding.hpx};
  `
})

export const BadIcon = styled(CancelIcon)(({ theme }) => {
  return  `
    color: ${colors.red10};
    margin-right: ${gutter.margin.hpx};
  `
})

export const GoodIcon = styled(CheckIcon)(({ theme }) => {
  return  `
    color: ${colors.green10};
    margin-right: ${gutter.margin.hpx};
  `
})

export const ErrorTitleContainer = styled(Box)(({ theme }) => {
  
  return `
    display: flex;
    flex-direction: row;
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

export const ErrorMsgContainer = styled(Box)(({ theme }) => {
  
  return `
    display: flex;
    flex-direction: row;
    margin-top: ${gutter.margin.qpx};
    margin-bottom: ${gutter.margin.dpx};
  `
})

export const ErrorProblemContainer = styled(Box)(({ theme }) => {
  
  return `
    width: 100%;
    border-radius: 5px;
    padding: ${gutter.padding.px};
    background-color: ${getColor(colors.red01, colors.red20)}
  `
})

export const ErrorFixContainer = styled(Box)(({ theme }) => {
  
  return `
    width: 100%;
    border-radius: 5px;
    padding: ${gutter.padding.px};
    background-color: ${getColor(colors.green01, colors.green20)}
  `
})

export const ErrorMsg = styled(Text)(({ theme }) => {
  
  return `
    font-size: 16px;
    font-weight: bold;
    margin-bottom: ${gutter.margin.px};
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