import type { ReactNode } from 'react'
import type { TRaceDeco } from '@GBR/types'

import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'
import { DecoFailContainer } from './Deco.styled'

export type TDecoFail = {
  deco?:TRaceDeco
  children:ReactNode
}

export const DecoFail = (props:TDecoFail) => {
  const { children } = props

    return (
      <>
        <DecoFailContainer>
          Deco Fail
        </DecoFailContainer>
        {children}
      </>
    )
}
