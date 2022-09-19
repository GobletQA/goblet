import * as React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { AppHeader } from './Header.styled'

import { Logo } from './Logo'
import { Settings } from './Settings'

type THeaderProps = {
  settings?: string[]
}

export const Header = (props:THeaderProps) => {
  const settings = props.settings || []

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppHeader position="fixed">
      <Toolbar disableGutters>
        <Box sx={{ flex: 1 }} />
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

