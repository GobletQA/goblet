import type { CSSProperties } from 'react'
import type { Theme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import {
  dims,
  colors,
  getColor,
  IconButton
} from '@gobletqa/components'


const noForwardProps = [
  `open`,
  `disablePortal`
] as any[]

const shared:CSSProperties = {
  padding: `0px`,
  border: `none`,
  overflowY: `hidden`,
}

const openedStyles = (theme: Theme): CSSProperties => ({
  ...shared,
  height: dims.defs.openedHeight,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedStyles = (theme: Theme): CSSProperties => ({
  ...shared,
  height: dims.defs.closedHeight,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

export const Drawer = styled(
  MuiDrawer,
  { shouldForwardProp: (prop) => !noForwardProps.includes(prop) }
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
    [`& button.MuiTab-root.Mui-selected`]: {
      color: getColor(colors.gray05, colors.purple02, theme),
      backgroundColor: getColor(colors.gray00, colors.purple17, theme),

      [`&:hover`]: {
        color: getColor(colors.royalPurple, colors.purple02, theme),
        backgroundColor: getColor(colors.white, colors.purple17, theme)
      }
    }
  }),
}))


export const BottomDrawerContainer = styled(Box)`
  width: 100%;
  height: 100%;
  background-color: ${getColor(colors.gray00, colors.black12)};
`

export const DrawerSliderActions = styled(Box)`
  right: 0px;
  display: flex;
  position: absolute;
`

export const DrawerSliderAction = styled(IconButton)`
  border-radius: 0px;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  height: ${dims.defs.header.hpx};
  width: ${dims.defs.header.height + 8}px;
  background-color: ${getColor(colors.gray01, colors.black11)};
  transition: background-color 500ms ease-in-out, color 500ms ease-in-out;
  border-left: 1px solid ${getColor(colors.gray02, colors.black13)};
  border-bottom: 1px solid ${getColor(colors.gray02, colors.black14)};
  
  &:hover {
    background-color: ${getColor(colors.white, colors.black14)};
  }
`

export const DrawerActionIconContainer = styled(Box)`
`


