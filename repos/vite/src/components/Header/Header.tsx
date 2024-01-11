import type { MouseEvent } from 'react'
import type { TSettingNavItem, TGobletSettings } from '@types'
import { useCallback } from 'react'
import Box from '@mui/material/Box'
import { Settings } from './Settings'
import { HeaderLogo } from './HeaderLogo'
import Toolbar from '@mui/material/Toolbar'
import { useStateReset } from '@hooks/useReset'
import {useSettingValues} from '@hooks/settings/useSettingValues'
import { updateSettingValue } from '@actions/settings/updateSettingValue'
import {
  AppHeader,
  ToggleBinBAction,
  ToggleThemeAction,
} from './Header.styled'
import {
  EThemeMode,
  useThemeType,
  DarkModeIcon,
  LightModeIcon,
  WebAssetIcon,
  WebAssetOffIcon,
} from '@gobletqa/components'



type THeaderProps = {
  meuItems?: TSettingNavItem[]
}

const styles = {
  icon: { height: `20px`, width: `20px` }
}

export const Header = (props:THeaderProps) => {
  const meuItems = props.meuItems || []
  const { type, setType } = useThemeType()
  const { browserInBrowser } = useSettingValues<TGobletSettings>(`goblet`)

  const onChangeTheme = useCallback(() => {
    const updated = type === EThemeMode.light
      ? EThemeMode.dark
      : EThemeMode.light

    setType(updated)
  }, [type, setType])

  const onToggleBinB = useCallback(() => {
    updateSettingValue({
      value: !browserInBrowser,
      setting: `goblet.browserInBrowser`,
    })
  }, [browserInBrowser])

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
        <ToggleBinBAction
          onClick={onToggleBinB}
          tooltip='Show or hide the browser in browser UI'
        >
        {
          browserInBrowser
            ? (<WebAssetIcon style={styles.icon} />)
            : (<WebAssetOffIcon style={styles.icon} />)
        }
        </ToggleBinBAction>
        <ToggleThemeAction
          onClick={onChangeTheme}
          tooltip='Toggle theme to light or dark'
        >
        {
          type === EThemeMode.light
            ? (<LightModeIcon style={styles.icon} />)
            : (<DarkModeIcon style={styles.icon} />)
        }
        </ToggleThemeAction>
        <Settings
          settings={meuItems}
          anchorEl={anchorEl}
          onOpenSettings={updateAnchor}
          onCloseSettings={resetAnchor}
        />
      </Toolbar>
    </AppHeader>
  )
}

