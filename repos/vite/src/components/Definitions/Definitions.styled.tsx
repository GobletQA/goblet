import type { Theme, CSSObject } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import List from '@mui/material/List'
import MuiDrawer from '@mui/material/Drawer'
import { colors, dims } from '@theme'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import { getColor } from '@utils/theme/getColor'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import { Text, Paragraph, Span } from '@components/Text'
import ListItemButton from '@mui/material/ListItemButton'
import { IconButton } from '@components/Buttons/IconButton'


const shared:CSSObject = {
  padding: `0px`,
  border: `none`,
  overflowY: `hidden`,
  left: dims.nav.closedWidth,
}

const openedStyles = (theme: Theme): CSSObject => ({
  ...shared,
  height: dims.defs.openedHeight,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedStyles = (theme: Theme): CSSObject => ({
  ...shared,
  left: dims.nav.closedWidth,
  height: dims.defs.closedHeight,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: `nowrap`,
    boxSizing: `border-box`,
    height: dims.defs.openedHeight,
    ...(open && {
      ...openedStyles(theme),
      '& .MuiDrawer-paper': openedStyles(theme),
    }),
    ...(!open && {
      ...closedStyles(theme),
      '& .MuiDrawer-paper': closedStyles(theme),
    }),
  }),
)

const tabHeight = `
  max-height: ${dims.defs.header.hpx};
  min-height: ${dims.defs.header.hpx};
`

export const DefsContainer = styled(Box)(({ theme }) => `
  height: 100%;
  background-color: ${getColor(colors.white00, colors.black01, theme)};
`)

export const DefsHeaderTabs = styled(Tabs)(({ theme }) => `
  ${tabHeight}

  & button {
    opacity: 1;
    text-transform: none;
    ${tabHeight}
  }

  & .MuiTabs-indicator {
    display: none;
  }

`)

export const DefsHeaderTab = styled(Tab)(({ theme }) => `
  ${tabHeight}
  flex-direction: row;
  letter-spacing: 0.2px;
  max-width: calc( 50% - ${(dims.defs.header.height / 2) + 8}px );
  min-width: calc( 50% - ${(dims.defs.header.height / 2) + 8}px );
  font-weight: ${theme.typography.fontWeightBold};
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

  color: ${getColor(colors.fadeDark30, colors.fadeLight55, theme)};
  background-color: ${getColor(colors.gray04, colors.black03, theme)};

  &.Mui-selected {
    color: ${getColor(colors.fadeDark70, colors.fadeLight90, theme)};
    background-color: ${getColor(colors.gray01, colors.black05, theme)};
  }

  &:hover:not(.Mui-selected) {
    color: ${getColor(colors.fadeDark50, colors.fadeLight75, theme)};
    background-color: ${getColor(colors.gray02, colors.black04, theme)};
  }

`)

export const DefsExpandBtn = styled(IconButton)(({ theme }) => `
  right: 0px;
  display: flex;
  border-radius: 0px;
  position: absolute;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  width: ${dims.defs.header.height + 16}px;
  height: ${dims.defs.header.hpx};
  background-color: ${getColor(colors.gray01, colors.black05, theme)};
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
  border-left: 1px solid ${getColor(colors.gray02, colors.black05, theme)};
  
  &:hover {
    background-color: ${getColor(colors.gray03, colors.fadeLight10, theme)};
  }
`)

export const DefTabPanel = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
`)

export const DefsBody = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${getColor(colors.gray01, colors.black05, theme)};
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

