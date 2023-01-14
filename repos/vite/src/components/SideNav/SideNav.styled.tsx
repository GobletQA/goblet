import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import { dims } from '@gobletqa/components/theme'
import { styled, Theme, CSSObject } from '@mui/material/styles'

const openedMixin = (theme: Theme): CSSObject => ({
  overflowX: `hidden`,
  borderRight: `unset`,
  width: dims.nav.openWidth,
  transition: theme.transitions.create(`width`, {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => {
  return ({
    overflowX: `hidden`,
    borderRight: `unset`,
    width: dims.nav.closedWidth,
    transition: theme.transitions.create(`width`, {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  })
}


export const HeaderSpacer = styled(Box)`
  height: ${dims.header.hpx};
`

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: `nowrap`,
    boxSizing: `border-box`,
    width: dims.nav.openWidth,
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