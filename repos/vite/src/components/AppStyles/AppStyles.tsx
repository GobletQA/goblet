import { globalStyles } from '@theme/global'
import type { TGobletTheme } from '@gobletqa/components'


export type TAppStyles = {
  theme:TGobletTheme
}

export const AppStyles = (props:TAppStyles) => {
  return (<style>{globalStyles(props)}</style>)
}