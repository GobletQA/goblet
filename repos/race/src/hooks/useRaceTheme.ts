
import { useMemo, useState } from 'react'
import {
  getTheme,
  EThemeMode,
  TEditorTheme,
  loadGobletTheme
} from '@gobletqa/components'

export type THRaceTheme = {
  themeType?: EThemeMode
}

const hasCorrectTheme = (themeType:EThemeMode, theme?:TEditorTheme) => {
  const isDark = theme?.base === `vs-dark` && themeType === EThemeMode.dark
  const isLight = theme?.base === `vs` && themeType === EThemeMode.light

  return theme && (isDark || isLight)
}

// TODO: investigate only saving the theme.base value
// As of now there's not need to store the entire theme object in state
export const useRaceTheme = (props?:THRaceTheme) => {
  const [theme, setTheme] = useState<TEditorTheme>()

  const type = props?.themeType
    || getTheme()?.palette?.mode
    || EThemeMode.light

  useMemo(() => {
    !hasCorrectTheme(type, theme)
      && (async () => {
          const theme = await loadGobletTheme({ type, context: `race` })
          theme && setTheme(theme)
        })()

  }, [theme, type])

  return [theme, setTheme]
}