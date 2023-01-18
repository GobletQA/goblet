import type { TGobletTheme } from '@gobletqa/components'

import { useMemo } from 'react'
import { getColor, useTheme } from '@gobletqa/components'

export const useColor = (
  light:string|number,
  dark:string|number,
  theme?:TGobletTheme
) => {
  theme = theme || useTheme()
  return useMemo(() => getColor(light, dark, theme), [light, dark, theme])
}