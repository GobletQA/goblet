import { useMemo } from 'react'
import { getColor, useTheme } from '@gobletqa/components'

export type TUColors = {
  [key:string]: [string|number, string|number]
}

export type TThemeColors = {
  [key:string]: string
}

export const useColors = (colors:TUColors) => {
  const theme = useTheme()
  return useMemo(() => {
    return Object.entries(colors)
      .reduce((mapped, [key, [light, dark]]) => {
        mapped[key] = getColor(light, dark, theme)

        return mapped
      }, {} as TThemeColors)
  }, [colors, theme])
}