import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import {
  Span,
  Text,
  colors,
  getColor,
} from '@gobletqa/components'


export const Item = styled(ListItem)(({ theme }) => `
  padding: 5px 0px 0px;
  min-height: 35px;
  flex-direction: column;
  transition: background-color 500ms ease-in-out, color 500ms ease-in-out;
  color: ${getColor(colors.black09, colors.gray04, theme)};
  background-color: ${getColor(colors.gray00, colors.black10, theme)};

  &.item-open {
    background-color: ${getColor(colors.white, colors.black13, theme)};
    color: ${getColor(colors.black09, colors.white, theme)};
    
    & .gb-def-item-action {
      opacity: 1;
      color: ${getColor(colors.gray11, colors.fadeLight50, theme)};
    }

  }

  &:hover {
    background-color: ${getColor(colors.white, colors.black13, theme)};
    color: ${getColor(colors.black09, colors.white, theme)};
    
    & .gb-def-item-action {
      opacity: 1;
      color: ${getColor(colors.gray15, colors.fadeLight50, theme)};
    }
    
  }

  & .gb-def-item-meta-toggle {
    padding-right: 0px;
  }
  
`)


export const ItemRow = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  padding: 0px 5px 5px;
`)

export const ItemText = styled(ListItemText)(({ theme }) => `
  flex-grow: 1;
`)


export const ItemIcon = styled(ListItemIcon)(({ theme }) => `
  min-width: initial;
`)

export const ItemMetaCollapse = styled(Collapse)(({ theme }) => `
  width: 100%;
`)

export const ItemButton = styled(ListItemButton)(({ theme }) => `
  padding: 0;
  flex-grow: 0;
  padding-right: 0px;
  font-weight: bold;
  color: ${getColor(colors.gray05, colors.black08, theme)};
  transition: background-color 500ms ease-in-out, color 500ms ease-in-out, opacity 500ms ease-in-out;

  &.gb-def-item-action {
    opacity: 0;
  }

  &:hover {
    color: ${colors.royalPurple} !important;
  }

  &.gb-def-open-file:hover {
    color: ${colors.shinyShamrock} !important;
  }
`)

export const ItemMeta = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 40px;
  padding: 10px 20px;
  padding-left: 25px;
  flex-direction: column;
`)

export const MetaItemWrap = styled(Box)(({ theme }) => `
  margin-bottom: 10px;
`)

export const MetaItemExpWrap = styled(Box)(({ theme }) => `
  margin-bottom: 0px;
`)

export const MetaExpItemWrap = styled(Box)(({ theme }) => `
  padding-left: 10px;
`)

export const MetaTitle = styled(Text)(({ theme }) => `
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`)

export const MetaItemPair = styled(Box)(({ theme }) => `
`)

export const MetaItemTitle = styled(Span)(({ theme }) => `
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
  padding-right: 5px;
`)

export const MetaItemText = styled(Span)(({ theme }) => `
  font-size: 14px;
  line-height: 16px;
  white-space: normal;
`)

