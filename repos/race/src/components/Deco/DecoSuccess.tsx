import type { ReactNode } from 'react'
import type { TRaceDeco } from '@GBR/types'

import { useFeatureDeco } from '@GBR/hooks/decorations/useFeatureDeco'
import { DecoSuccessContainer } from './Deco.styled'

export type TDecoPass = {
  deco?:TRaceDeco
  children:ReactNode
}

export const DecoSuccess = (props:TDecoPass) => {
  const { deco, children } = props

    return (
      <>
        <DecoSuccessContainer>
          Deco Success
        </DecoSuccessContainer>
        {children}
      </>
    )
}
