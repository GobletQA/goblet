import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Unstable_Grid2'
import { H4, Input, gutter } from '@gobletqa/components'

export const WorldEditorContainer = styled(Box)`
  flex-grow: 1;
  display: flex;
  background-color: transparent;
`

export const AliasListContainer = styled(Box)(({ theme }) => {
  return `
    height: 100%;
  `
})

export const AliasListActions = styled(Box)(({ theme }) => {
  return `
    padding: 0px ${gutter.padding.hpx};
    padding-left: ${gutter.padding.qpx}
  `
})

export const AliasList = styled(List)(({ theme }) => {
  return `
    width: 100%;
    padding-top: 0px;
    padding-bottom: ${gutter.padding.hpx};
  `
})

export const AliasListItem = styled(ListItem)(({ theme }) => {
  return `
    width: 100%;
    height: 70px;
    padding-left: 0px;
    padding-right: 0px;
  `
})


export const AliasItemGrid = styled(Grid)(({ theme }) => {
  return `
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  `
})

export const AliasItemCol = styled(Grid)(({ theme }) => {
  return `
    padding: 0px;
    height: 100%;
  `
})

export const AliasHeaderContainer = styled(Box)(({ theme }) => {
  return `
    font-weight: bold;
    padding: 0px ${gutter.padding.hpx} 0px ${gutter.padding.px};
  `
})

export const AliasNameContainer = styled(Box)(({ theme }) => {
  return `
    padding: 0px
    padding-right: ${gutter.padding.hpx};
    padding-left: ${gutter.padding.hpx};
  `
})

export const AliasValueContainer = styled(Box)(({ theme }) => {
  return `
    padding: 0px ${gutter.padding.px};
  `
})


export const AliasNameInput = styled(Input)(({ theme }) => {
  return ``
})

export const AliasValueInput = styled(Input)(({ theme }) => {
  return ``
})
