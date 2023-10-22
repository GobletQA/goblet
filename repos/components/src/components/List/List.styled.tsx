import MuiList from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'

import MuiListSubheader from '@mui/material/ListSubheader'
import {
  colors,
  getColor,
} from '@gobletqa/components'


export const List = styled(MuiList)(({ theme }) => `
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  padding-bottom: 285px;

  & ul {
    padding: 0px;
  }
`)

export const ListGroupContainer = styled(`li`)``
export const ListGroupItems = styled(`ul`)``

export const ListSubheader = styled(MuiListSubheader)(({ theme }) => `
  height: 40px;
  padding: 5px 10px;
  line-height: 30px;
  font-weight: bold;
  color: ${getColor(colors.gray19, colors.white, theme)};
  background-color: ${getColor(colors.white, colors.black14, theme)};
`)

export const ItemDivider = styled(Divider)(({ theme }) => `
  border-bottom: 1px solid ${getColor(colors.gray02, colors.black15, theme)};
`)

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
