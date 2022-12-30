
import { useMemo, useState } from 'react'
import {
  getTheme,
  EThemeType,
  TEditorTheme,
  loadGobletTheme
} from '@gobletqa/components'

export type THRaceTheme = {
  themeType?: EThemeType
}

const hasCorrectTheme = (themeType:EThemeType, theme?:TEditorTheme) => {
  const isDark = theme?.base === `vs-dark` && themeType === EThemeType.dark
  const isLight = theme?.base === `vs` && themeType === EThemeType.light

  return theme && (isDark || isLight)
}

// TODO: investigate only saving the theme.base value
// As of now there's not need to store the entire theme object in state
export const useRaceTheme = (props?:THRaceTheme) => {
  const [theme, setTheme] = useState<TEditorTheme>()

  const type = props?.themeType
    || getTheme()?.palette?.mode
    || EThemeType.light

  useMemo(() => {
    !hasCorrectTheme(type, theme)
      && (async () => {
          const theme = await loadGobletTheme(type, `race`)
          theme && setTheme(theme)
        })()

  }, [theme, type])

  return [theme, setTheme]
}