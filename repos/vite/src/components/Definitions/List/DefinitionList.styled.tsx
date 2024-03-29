import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Collapse from '@mui/material/Collapse'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import {
  dims,
  Span,
  Text,
  gutter,
  colors,
  getColor,
  IconButton,
} from '@gobletqa/components'


export const DefSearchTitle = styled(Span)(({ theme }) => `
  font-weight: bold;
  color: ${getColor(colors.gray19, colors.white, theme)};
`)

export const DefSearchHeader = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${dims.defs.header.height - 5}px;
`)

export const DefSearchWrap = styled(Box)(({ theme }) => `
  display: flex;
  position: relative;
  align-items: center;
`)

export const DefSearchIcon = styled(IconButton)(({ theme }) => `
  left: 11px;
  padding: 3px;
  position: absolute;
  height: ${dims.defs.header.height - 8}px,
`)

export const DefSearchInput = styled('input')(({ theme }) => `
  min-width: 50%;
  border: none;
  font-size: 14px;
  line-height: 22px;
  border-radius: 18px;
  font-family: inherit;
  letter-spacing: 0.2px;
  padding: 0 14px 0 33px;
  margin: 0 0 0 ${gutter.margin.hpx};
  height: ${dims.defs.header.height - 8}px;
  color: ${getColor(colors.black09, colors.white, theme)};
  background-color: ${getColor(colors.gray01, colors.black19, theme)};

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid ${colors.royalPurple};
  }
`)

export const DefTabPanel = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
`)

export const DefsList = styled(List)(({ theme }) => `
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  padding-bottom: 285px;

  & ul {
    padding: 0px;
  }
`)

export const DefListSubheader = styled(ListSubheader)(({ theme }) => `
  height: 40px;
  padding: 5px 10px;
  line-height: 30px;
  font-weight: bold;
  color: ${getColor(colors.gray19, colors.white, theme)};
  background-color: ${getColor(colors.white, colors.black14, theme)};
`)

export const DefItemDivider = styled(Divider)(({ theme }) => `
  border-bottom: 1px solid ${getColor(colors.gray02, colors.black15, theme)};
`)

export const DefItem = styled(ListItem)(({ theme }) => `
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

export const DefItemRow = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  padding: 0px 5px 5px;
`)

export const DefText = styled(ListItemText)(({ theme }) => `
  flex-grow: 1;
`)


export const DefIcon = styled(ListItemIcon)(({ theme }) => `
  min-width: initial;
`)

export const DefMetaCollapse = styled(Collapse)(({ theme }) => `
  width: 100%;
  border-left: 10px solid ${getColor(colors.gray04, colors.black19, theme)};
`)

export const DefButton = styled(ListItemButton)(({ theme }) => `
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

export const DefItemMeta = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 40px;
  padding: 10px 20px;
  padding-left: 25px;
  flex-direction: column;
`)

export const DefMetaItemWrap = styled(Box)(({ theme }) => `
  margin-bottom: 10px;
`)

export const DefMetaItemExpWrap = styled(Box)(({ theme }) => `
  margin-bottom: 0px;
`)

export const DefMetaExpItemWrap = styled(Box)(({ theme }) => `
  padding-left: 10px;
`)

export const DefMetaTitle = styled(Text)(({ theme }) => `
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`)

export const DefMetaItemPair = styled(Box)(({ theme }) => `
`)

export const DefMetaItemTitle = styled(Span)(({ theme }) => `
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
  padding-right: 5px;
`)

export const DefMetaItemText = styled(Span)(({ theme }) => `
  font-size: 14px;
  line-height: 16px;
  white-space: normal;
`)

