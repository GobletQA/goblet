import type { MouseEvent } from 'react'
import type { TSettingNavItem } from '@types'

import Box from '@mui/material/Box'
import { Settings } from './Settings'
import Toolbar from '@mui/material/Toolbar'
import { AppHeader } from './Header.styled'
import { useStateReset } from '@hooks/useReset'
import { HeaderLogo } from './HeaderLogo'

type THeaderProps = {
  settings?: TSettingNavItem[]
}

export const Header = (props:THeaderProps) => {
  const settings = props.settings || []
  
  const [
    anchorEl,
    __,
    resetAnchor,
    updateAnchor,
  ] = useStateReset<null | HTMLElement, MouseEvent<HTMLElement>>(null, null, `currentTarget`)

  return (
    <AppHeader position="fixed">
      <Toolbar disableGutters>
        <HeaderLogo />
        <Box sx={{ flex: 1 }} />
        <Settings
          settings={settings}
          anchorEl={anchorEl}
          onOpenSettings={updateAnchor}
          onCloseSettings={resetAnchor}
        />
      </Toolbar>
    </AppHeader>
  )
}

