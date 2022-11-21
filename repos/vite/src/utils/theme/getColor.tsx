import type { TGobletTheme } from '@types'
import type { Theme } from '@mui/material/styles'

import { getTheme } from '@theme'
import { get } from '@keg-hub/jsutils'

export const getColor = <T=string>(
  light:string|number,
  dark:string|number,
  theme:TGobletTheme|Theme=getTheme()
) => {
  const { palette } = (theme as TGobletTheme)
  const lColor = get(palette, `${light}`, light)
  const dColor = get(palette, `${dark}`, dark)

  return (palette.mode === `light` ? lColor || dColor : dColor || lColor) as T
}