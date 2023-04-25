import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import { H4, Input, gutter } from '@gobletqa/components'

export const WorldEditorContainer = styled(Box)``

export const WorldEditorContent = styled(Box)(({ theme }) => {
  return `
    top: 50%;
    left: 25%;
    box-shadow: 24;
    min-width: 40%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding-top: ${gutter.padding.qpx};
    padding-bottom: ${gutter.padding.dpx};
    background-color: ${theme.palette.background.paper};
  `
})


export const AliasListContainer = styled(Box)(({ theme }) => {
  return `
    margin-top: ${gutter.margin.qpx};
    padding: 0 ${gutter.padding.px};
  `
})

export const AliasListActions = styled(Box)(({ theme }) => {
  return `

  `
})


export const WorldAliasHeader = styled(Box)(({ theme }) => {
  return `
    width: 100%;
    padding: ${gutter.padding.px};
  `
})

export const WorldAliasHeaderText = styled(H4)(({ theme }) => {
  return `
    padding: ${gutter.padding.qpx};
    padding-top: 0px;
  `
})


export const AliasList = styled(List)(({ theme }) => {
  return `
    width: 100%;
    padding: ${gutter.padding.hpx} 0;
  `
})

export const AliasListItem = styled(ListItem)(({ theme }) => {
  return `
    width: 100%;
    padding-top: 0px;
    padding-bottom: 0px;
  `
})

export const AliasNameContainer = styled(Box)(({ theme }) => {
  return `
    width: 32%;
    padding: 0px ${gutter.padding.hpx} 0px ${gutter.padding.px};
  `
})

export const AliasValueContainer = styled(Box)(({ theme }) => {
  return `
    width: 62%;
    padding: 0px ${gutter.padding.px} 0px ${gutter.padding.hpx};
  `
})


export const AliasNameInput = styled(Input)(({ theme }) => {
  return `
    width: 100%;
  `
})

export const AliasValueInput = styled(Input)(({ theme }) => {
  return `
    width: 100%;
  `
})