import type { MouseEvent } from 'react'
import type { TSettingNavItem } from '@types'

import { gutter } from '@theme'
import { useCallback } from 'react'
import { EThemeType } from '@types'
import Box from '@mui/material/Box'
import { Settings } from './Settings'
import { HeaderLogo } from './HeaderLogo'
import Toolbar from '@mui/material/Toolbar'
import { AppHeader } from './Header.styled'
import { useStateReset } from '@hooks/useReset'
import { useThemeType } from '@contexts/ThemeTypeContext'
import { IconButton } from '@components/Buttons/IconButton'
import { DarkModeIcon, LightModeIcon } from '@components/Icons'

type THeaderProps = {
  settings?: TSettingNavItem[]
}

const styles = {
  iconBtn: { marginRight: gutter.margin.hpx },
  icon: { height: `20px`, width: `20px` }
}

export const Header = (props:THeaderProps) => {
  const settings = props.settings || []
  const { type, setType } = useThemeType()
  
  const onChangeTheme = useCallback(() => {
    const updated = type === EThemeType.light
      ? EThemeType.dark
      : EThemeType.light

    setType(updated)
  }, [type, setType])

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
        <Box flex={1} />
        <IconButton
          style={styles.iconBtn}
          onClick={onChangeTheme}
        >
        {
          type === EThemeType.light
            ? (<LightModeIcon style={styles.icon} />)
            : (<DarkModeIcon style={styles.icon} />)
        }
        </IconButton>
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

