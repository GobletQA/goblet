import type { Theme } from '@mui/material/styles'
import type { TGobletTheme } from '@gobletqa/components'

import { get } from '@keg-hub/jsutils'
import { EThemeType, getTheme } from '@gobletqa/components'

export const getColor = <T=string>(
  light:string|number,
  dark:string|number,
  theme:TGobletTheme|Theme=getTheme()
) => {
  const { palette } = (theme as TGobletTheme)
  const lColor = get(palette, `${light}`, light)
  const dColor = get(palette, `${dark}`, dark)

  return (palette.mode === EThemeType.light ? lColor || dColor : dColor || lColor) as T
}