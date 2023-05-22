import type { ReactNode } from 'react'
import type { TRaceDeco } from '@GBR/types'

import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'
import { DecoSpinContainer } from './Deco.styled'

export type TDecoSpin = {
  deco?:TRaceDeco
  children:ReactNode
}

export const DecoSpin = (props:TDecoSpin) => {
  const { children } = props

    return (
      <>
        <DecoSpinContainer>
          Deco Spinner
        </DecoSpinContainer>
        {children}
      </>
    )
}
