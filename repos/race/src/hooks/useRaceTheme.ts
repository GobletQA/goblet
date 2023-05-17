import type { TEditorTheme } from '@gobletqa/components'

import { useMemo, useState } from 'react'
import { useSettings } from '@GBR/contexts'
import {
  getTheme,
  EThemeMode,
  loadGobletTheme,
  EGobletThemeName,
} from '@gobletqa/components'

export type THRaceTheme = {}

const hasCorrectTheme = (themeType:EGobletThemeName, theme?:TEditorTheme) => {
  const isDark = theme?.base === `vs-dark` && themeType === EGobletThemeName.dark
  const isLight = theme?.base === `vs` && themeType === EGobletThemeName.light

  return theme && (isDark || isLight)
}

export const useRaceTheme = () => {

  const { settings } = useSettings()
  const [theme, setTheme] = useState<TEditorTheme>()

  const type = settings.themeType
    || getTheme()?.palette?.mode
    || EThemeMode.light

  useMemo(() => {
    !hasCorrectTheme(type, theme)
      && (async () => {
          const mode = type.split(`-`).pop()
          const loaded = await loadGobletTheme({ mode, name: type, context: `race` })
          loaded && setTheme(loaded)
        })()
  }, [theme, type])

  return [theme, setTheme]
}