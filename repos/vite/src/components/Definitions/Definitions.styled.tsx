import type { Theme, CSSObject } from '@mui/material/styles'

import { dims } from '@theme'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import { IconButton } from '@components/Buttons/IconButton'

const openedMixin = (theme: Theme): CSSObject => ({
  border: `none`,
  padding: `0px`,
  left: dims.nav.closedWidth,
  height: dims.defs.openedHeight,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowY: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  left: `50px`,
  border: `none`,
  padding: `0px`,
  overflowY: `hidden`,
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
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)


export const DefsExpandBtn = styled(IconButton)(({ theme }) => `
  right: 0px;
  width: 48px;
  display: flex;
  border-radius: 0px;
  position: absolute;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
`)