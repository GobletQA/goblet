import type { Theme, CSSObject } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { colors, dims } from '@theme'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { getColor } from '@utils/theme/getColor'
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

  color: ${getColor(colors.fadeLight30, colors.fadeLight55, theme)};
  background-color: ${getColor(colors.gray09, colors.black03, theme)};

  &.Mui-selected {
    color: ${getColor(colors.fadeDark70, colors.fadeLight90, theme)};
    background-color: ${getColor(colors.gray01, colors.black05, theme)};
  }

  &:hover:not(.Mui-selected) {
    color: ${getColor(colors.fadeDark65, colors.fadeLight75, theme)};
    background-color: ${getColor(colors.gray04, colors.black04, theme)};
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

`)

export const DefsBody = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${getColor(colors.gray01, colors.black05, theme)};
`)