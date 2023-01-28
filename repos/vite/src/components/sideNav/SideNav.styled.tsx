import { CSSProperties, ComponentProps } from 'react'

import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import { dims } from '@gobletqa/components/theme'
import { styled, Theme } from '@mui/material/styles'

export type DrawerComp = ComponentProps<typeof MuiDrawer> & {
  open:boolean
  sidebarLocked:boolean
}

const openedMixin = (theme: Theme, locked:boolean): CSSProperties => {
  return {
    overflowX: `hidden`,
    borderRight: `unset`,
    width: dims.nav.openWidth,
    transition: locked
      ? `none`
      : theme.transitions.create(`width`, {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
  }
}

const closedMixin = (theme: Theme, locked:boolean): CSSProperties => {
  return {
    overflowX: `hidden`,
    borderRight: `unset`,
    width: dims.nav.closedWidth,
    transition: locked
      ? `none`
      : theme.transitions.create(`width`, {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
  }
}


export const HeaderSpacer = styled(Box)`
  height: ${dims.header.hpx};
`

export const Drawer = styled<((props: DrawerComp) => JSX.Element)>(
  MuiDrawer,
  { shouldForwardProp: (prop) => prop !== `open` && prop !== `sidebarLocked` }
)(
  ({ theme, open, sidebarLocked }) => ({
    flexShrink: 0,
    whiteSpace: `nowrap`,
    boxSizing: `border-box`,
    width: dims.nav.openWidth,
    ...(open && {
      ...openedMixin(theme, sidebarLocked),
      '& .MuiDrawer-paper': openedMixin(theme, sidebarLocked),
    }),
    ...(!open && {
      ...closedMixin(theme, sidebarLocked),
      '& .MuiDrawer-paper': closedMixin(theme, sidebarLocked),
    }),
  }),
)