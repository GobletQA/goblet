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

export const DefsContainer = styled(Box)(({ theme }) => `
  height: 100%;
  background-color: ${getColor(colors.white00, colors.black01, theme)};
`)

export const DefsHeaderTabs = styled(Tabs)(({ theme }) => `
  max-height: ${dims.defs.header.hpx};
  min-height: ${dims.defs.header.hpx};
  color: ${getColor(colors.gray05, colors.black05, theme)};
  background-color: ${getColor(colors.gray00, colors.black05, theme)};
  border-bottom: 1px solid ${getColor(colors.gray01, colors.black02, theme)};

  & button {
    max-height: ${dims.defs.header.hpx};
    min-height: ${dims.defs.header.hpx};
    font-weight: bold;
    text-transform: none;
  }

  & .MuiTabs-indicator {
    display: none;
  }

`)

export const DefsHeaderTab = styled(Tab)(({ theme }) => `
  letter-spacing: 0.2px;
  max-height: ${dims.defs.header.hpx};
  min-height: ${dims.defs.header.hpx};
  transition: background-color 200ms ease, color 200ms ease;

  &.Mui-selected {
    color: ${getColor(colors.black06, colors.white00, theme)};
    background-color: ${getColor(colors.gray03, colors.black02, theme)};
  }

  &:hover {
    color: ${getColor(colors.black06, colors.white00, theme)};
    background-color: ${getColor(colors.gray03, colors.black02, theme)};
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
  width: ${dims.defs.header.hpx};
  height: ${dims.defs.header.hpx};
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
`)

export const DefTabPanel = styled(Box)(({ theme }) => `

`)