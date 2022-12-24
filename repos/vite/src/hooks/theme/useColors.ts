import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { getColor } from '@utils/theme/getColor'

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