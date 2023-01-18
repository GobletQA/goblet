import type { TGobletTheme } from '@gobletqa/components'

import { utility } from '@GBC/theme/utility'
import { MemoChildren } from '@GBC/components/MemoChildren'
export type TAppStyles = {
  theme:TGobletTheme
  globalStyles?:(props:Record<`theme`, TGobletTheme>) => string
}

export const AppStyles = (props:TAppStyles) => {
  const { theme, globalStyles } = props
  return (
    <MemoChildren>
      <style>
        {utility}
        {globalStyles?.({ theme }) || ``}
      </style>
    </MemoChildren>
  )
}