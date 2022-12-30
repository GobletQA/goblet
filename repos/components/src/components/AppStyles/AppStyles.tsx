import type { TGobletTheme } from '@gobletqa/components'

export type TAppStyles = {
  theme:TGobletTheme
  globalStyles?:(props:Record<`theme`, TGobletTheme>) => string
}

export const AppStyles = (props:TAppStyles) => {
  const { theme, globalStyles } = props
  return (<style>{globalStyles?.({ theme }) || ``}</style>)
}