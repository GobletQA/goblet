import { useMemo } from 'react'
import { getColor, useTheme } from '@gobletqa/components'

export const useColor = (light:string|number, dark:string|number) => {
  const theme = useTheme()
  return useMemo(() => getColor(light, dark, theme), [light, dark])
}