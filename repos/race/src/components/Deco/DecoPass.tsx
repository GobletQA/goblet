import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode } from 'react'

import { forwardRef } from 'react'
import { DecoPassIcon, DecoPassContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  children:ReactNode
}

export const DecoPass = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props

    return (
      <>
        <DecoPassContainer
          {...rest}
          ref={ref}
          className='gb-deco-icon-pass-container'
        >
          <DecoPassIcon className='gb-deco-icon-pass' />
        </DecoPassContainer>
        {children}
      </>
    )
})
