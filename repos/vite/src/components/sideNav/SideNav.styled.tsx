import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import { dims } from '@gobletqa/components/theme'
import { styled, Theme, CSSObject } from '@mui/material/styles'

const openedMixin = (theme: Theme): CSSObject => ({
  width: dims.nav.openWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => {
  return (
    {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: dims.nav.closedWidth,
    }
  )
}


export const HeaderSpacer = styled(Box)`
  height: ${dims.header.hpx};
`

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    width: dims.nav.openWidth,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
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