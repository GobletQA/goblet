import * as React from 'react'
import { useState } from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'

import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'


import { NavGroups, TGroupItem } from '../NavList'

const drawerWidth = 240


const groups = [
  {
    name: 'group 1',
    items: [
      {
        title: 'Group1 - Item 1'
      },
      {
        title: 'Group1 - Item 2'
      },
      {
        title: 'Group1 - Item 3'
      },
    ]
  },
  {
    name: 'group 2',
    items: [
      {
        title: 'Group2 - Item 1'
      },
      {
        title: 'Group2 - Item 2'
      },
      {
        title: 'Group2 - Item 3'
      },
    ]
  },
  {
    name: 'group 3',
    items: [
      {
        title: 'Group3 - Item 1'
      },
      {
        title: 'Group3 - Item 2'
      },
      {
        title: 'Group3 - Item 3'
      },
    ]
  },
]


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    width: drawerWidth,
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

type TSideNavProps = {
  groups?: TGroupItem[]
  initialOpen?: boolean
}


export const SideNav = (props:TSideNavProps) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <NavGroups
        {...props}
        open={open}
        groups={groups}
        toggleDrawer={toggleDrawer}
      />
    </Drawer>
  )
}
