import type { TGobletTheme } from '@types'
import { globalStyles } from '@theme/global'

import { useMemo } from 'react'

export type TAppStyles = {
  theme:TGobletTheme
}

export const AppStyles = (props:TAppStyles) => {
  return (<style>{globalStyles(props)}</style>)
}