import Box from '@mui/material/Box'
import List from '@mui/material/List'
import { colors } from '@theme'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import { getColor } from '@utils/theme/getColor'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import { Text, Paragraph, Span } from '@components/Text'
import ListItemButton from '@mui/material/ListItemButton'


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
  background-color: ${getColor(colors.white00, colors.black02, theme)};
`)

export const DefItem = styled(ListItem)(({ theme }) => `
  padding: 5px;
  min-height: 35px;
  flex-direction: column;
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

  &:hover {
    background-color: ${getColor(colors.white00, colors.black04, theme)};
  }

  & .goblet-def-item-meta-toggle {
    padding-right: 0px;
  }
  
`)

export const DefItemRow = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
`)

export const DefText = styled(ListItemText)(({ theme }) => `
  flex-grow: 1;
  margin-left: 5px;
  color: ${getColor(colors.black06, colors.white00, theme)};
`)


export const DefIcon = styled(ListItemIcon)(({ theme }) => `
  min-width: initial;
`)


export const DefButton = styled(ListItemButton)(({ theme }) => `
  padding: 0;
  flex-grow: 0;
  padding-right: 0px;
  font-weight: bold;
  color: ${getColor(colors.fadeDark50, colors.fadeLight50, theme)};
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

  &:hover {
    color: ${colors.royalPurple};
  }

  &.goblet-def-open-file:hover {
    color: ${colors.shinyShamrock};
  }
`)

export const DefItemMeta = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100px;
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
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
`)

export const DefMetaItemPair = styled(Paragraph)(({ theme }) => `
`)

export const DefMetaItemTitle = styled(Span)(({ theme }) => `
  font-size: 12px;
  font-weight: bold;
  padding-right: 5px;
`)
export const DefMetaItemText = styled(Span)(({ theme }) => `
  font-size: 12px;
`)

