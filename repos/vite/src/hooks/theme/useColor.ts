import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { getColor } from '@utils/theme/getColor'

export const useColor = (light:string|number, dark:string|number) => {
  const theme = useTheme()
  return useMemo(() => getColor(light, dark, theme), [light, dark])
}