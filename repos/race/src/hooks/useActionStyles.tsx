import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { deepMerge } from '@keg-hub/jsutils'
import { colors, getColor, useTheme } from '@gobletqa/components'

export type THActionStyles = {
  sx?:CSSProperties
  style?:CSSProperties
  styles?:CSSProperties
}

export const useActionStyles = (props:THActionStyles) => {
  const {
    sx,
    style,
    styles
  } = props

  const theme = useTheme()

  return useMemo(() => {
    return deepMerge<CSSProperties>({
      width: `24px`,
      height: `24px`,
      color: getColor(colors.gray08, colors.gray15, theme),
      [`& svg`]: {
        width: `22px`,
        height: `22px`,
      },
      [`&:hover`]: {
        color: colors.green10,
      },
    }, styles, style, sx)
  }, [theme])

}