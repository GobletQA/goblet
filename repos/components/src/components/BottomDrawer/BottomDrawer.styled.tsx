import type { CSSProperties } from 'react'
import type { Theme } from '@mui/material/styles'
import type { DrawerProps } from '@mui/material/Drawer'

import Box from '@mui/material/Box'
import { dims, colors } from '@GBC/theme'
import MuiDrawer from '@mui/material/Drawer'

import { styled } from '@mui/material/styles'
import { getColor } from '@GBC/utils/theme/getColor'
import { IconButton } from '@GBC/components/Buttons/IconButton'

const noForwardProps = [
  `open`,
  `disablePortal`,
  `drawerHeight`,
] as any[]

const shared:CSSProperties = {
  padding: `0px`,
  border: `none`,
  overflowY: `hidden`,
}

const openedStyles = (theme: Theme, height:string): CSSProperties => ({
  ...shared,
  height,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedStyles = (theme: Theme, height:string): CSSProperties => ({
  ...shared,
  height,
  transition: theme.transitions.create('height', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

type TDrawerProps = DrawerProps & {
  drawerHeight?:string
}

export const Drawer = styled(
  MuiDrawer,
  { shouldForwardProp: (prop) => !noForwardProps.includes(prop) }
)<TDrawerProps>(({ theme, open, drawerHeight }) => {

  const height = open
    ? drawerHeight || dims.defs.openedHeight
    : dims.defs.closedHeight
  
  return {
    height,
    flexShrink: 0,
    whiteSpace: `nowrap`,
    boxSizing: `border-box`,
    ...(open && {
      ...openedStyles(theme, height),
      '& .MuiDrawer-paper': openedStyles(theme, height),
    }),
    ...(!open && {
      ...closedStyles(theme, height),
      '& .MuiDrawer-paper': closedStyles(theme, height),
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
    })
  }
})


export const BottomDrawerContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  background-color: ${getColor(colors.gray00, colors.black12, theme)};
`)

export const DrawerSliderActions = styled(Box)`
  right: 0px;
  display: flex;
  position: absolute;
`

export const DrawerSliderAction = styled(IconButton)(({ theme }) => `
  border-radius: 0px;
  place-items: center;
  font-family: inherit;
  place-content: center;
  background-color: transparent;
  height: ${dims.defs.header.hpx};
  width: ${dims.defs.header.height + 8}px;
  background-color: ${getColor(colors.gray01, colors.black11, theme)};
  transition: background-color 500ms ease-in-out, color 500ms ease-in-out;
  border-left: 1px solid ${getColor(colors.gray02, colors.black13, theme)};
  border-bottom: 1px solid ${getColor(colors.gray02, colors.black14, theme)};
  
  &:hover {
    background-color: ${getColor(colors.white, colors.black14, theme)};
  }
`)

export const DrawerActionIconContainer = styled(Box)`
`


