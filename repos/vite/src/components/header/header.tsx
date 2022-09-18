import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'

import { Logo } from './Logo'
import { Tabs } from './Tabs'
import { Settings } from './Settings'

type THeaderProps = {
  pages?: string[]
  settings?: string[]
}

export const Header = (props:THeaderProps) => {
  const {
    pages=['Products', 'Pricing', 'Blog'],
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
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />
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
      </Container>
    </AppBar>
  )
}

