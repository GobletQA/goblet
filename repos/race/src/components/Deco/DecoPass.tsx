import type { ReactNode } from 'react'
import type { TRaceDeco } from '@GBR/types'

import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'
import { DecoPassContainer } from './Deco.styled'

export type TDecoPass = {
  deco?:TRaceDeco
  children:ReactNode
}

export const DecoPass = (props:TDecoPass) => {
  const { deco, children } = props

    return (
      <>
        <DecoPassContainer>
          Deco Pass
        </DecoPassContainer>
        {children}
      </>
    )
}
