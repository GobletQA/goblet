import * as React from 'react'
import { SideNav } from '@constants/Nav'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { AppHeader } from './Header.styled'

import { Logo } from './Logo'
import { Tabs } from './Tabs'
import { Settings } from './Settings'

type THeaderProps = {
  pages?: string[]
  settings?: string[]
}

export const Header = (props:THeaderProps) => {
  const {
    pages=[],
    settings=['Profile', 'Account', 'Dashboard', 'Logout']
  } = props
  
  
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const onTabClick = (event:any, tab:string) => {
    console.log(`------- tab -------`)
    console.log(tab)
  }

  return (
    <AppHeader position="fixed">
      <Toolbar disableGutters>
        <Tabs
          tabs={pages}
          anchorEl={anchorElNav}
          onTabClick={onTabClick}
          onOpenNav={handleOpenNavMenu}
          onCloseTab={handleCloseNavMenu}
        />
        <Logo mobile />
        <Settings
          settings={settings}
          anchorEl={anchorElUser}
          onOpenSettings={handleOpenUserMenu}
          onCloseSettings={handleCloseUserMenu}
        />
      </Toolbar>
    </AppHeader>
  )
}

