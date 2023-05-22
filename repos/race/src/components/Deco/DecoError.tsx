import type { ReactNode } from 'react'
import type { TRaceDeco } from '@GBR/types'

import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'
import { DecoErrorContainer } from './Deco.styled'

export type TDecoError = {
  deco?:TRaceDeco
  children:ReactNode
}

export const DecoError = (props:TDecoError) => {
  const { deco, children } = props

    return (
      <>
        <DecoErrorContainer>
          Deco Error
        </DecoErrorContainer>
        {children}
      </>
    )
}
