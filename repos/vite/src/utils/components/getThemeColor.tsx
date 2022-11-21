import type { TGobletTheme } from '@types'

import { GobletTheme } from '@theme'
import { get } from '@keg-hub/jsutils'

export const getThemeColor = (light:string, dark:string, theme:TGobletTheme=GobletTheme) => {
  const { mode } = theme.palette

  return mode === `light`
    ? get(GobletTheme.palette, light)
    : get(GobletTheme.palette, dark)
}