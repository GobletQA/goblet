import type { Theme, CSSObject } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { colors, dims } from '@theme'
import { DefinitionTabs } from '@constants'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { getColor } from '@utils/theme/getColor'
import { IconButton } from '@components/Buttons/IconButton'

const actionsWidth = (dims.defs.header.height + 8) * 2
const actionsWidthSplit = Math.round((actionsWidth / DefinitionTabs.length + Number.EPSILON) * 100) / 100

const tabWidth = Math.round((100 / DefinitionTabs.length + Number.EPSILON) * 100) / 100
const tabWidthStr = `calc( ${tabWidth}% - ${actionsWidthSplit}px )`

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

export const Drawer = styled(
  MuiDrawer,
  { shouldForwardProp: (prop) => prop !== 'open' }
)(({ theme, open }) => ({
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
  ...(!open && {
    [`& .goblet-defs-header-tabs button.MuiTab-root.Mui-selected`]: {
      color: getColor(colors.fadeDark30, colors.fadeLight55, theme),
      backgroundColor: getColor(colors.gray04, colors.black03, theme),

      [`&:hover`]: {
        color: getColor(colors.fadeDark50, colors.fadeLight75, theme),
        backgroundColor: getColor(colors.gray02, colors.black04, theme)
      }
    }
  }),
}))

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
  max-width: ${tabWidthStr};
  min-width: ${tabWidthStr};
  font-weight: ${theme.typography.fontWeightBold};
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

  color: ${getColor(colors.fadeDark30, colors.fadeLight55, theme)};
  background-color: ${getColor(colors.gray04, colors.black03, theme)};
  border-bottom: 1px solid ${getColor(colors.gray00, 'transparent', theme)};

  &.Mui-selected {
    color: ${getColor(colors.fadeDark80, colors.fadeLight90, theme)};
    background-color: ${getColor(colors.white00, colors.black05, theme)};
  }

  &:hover:not(.Mui-selected) {
    color: ${getColor(colors.fadeDark80, colors.fadeLight75, theme)};
    background-color: ${getColor(colors.white00, colors.black04, theme)};
  }
`)


export const DefsBody = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${getColor(colors.gray02, colors.black04, theme)};
`)

export const DefsSliderActions = styled(Box)(({ theme }) => `
  right: 0px;
  display: flex;
  position: absolute;
`)

export const DefsSliderAction = styled(IconButton)(({ theme }) => `
  border-radius: 0px;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  height: ${dims.defs.header.hpx};
  width: ${dims.defs.header.height + 8}px;
  background-color: ${getColor(colors.gray01, colors.black05, theme)};
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
  border-left: 1px solid ${getColor(colors.gray02, colors.black05, theme)};
  border-bottom: 1px solid ${getColor(colors.gray01, 'transparent', theme)};
  
  &:hover {
    background-color: ${getColor(colors.gray03, colors.fadeLight10, theme)};
  }
`)