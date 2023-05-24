import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode } from 'react'

import { forwardRef } from 'react'
import { DecoFailIcon, DecoErrorContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  children:ReactNode
}


export const DecoError = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props

    return (
      <>
        <DecoErrorContainer
          {...rest}
          ref={ref}
          className='gb-deco-icon-error-container'
        >
          <DecoFailIcon className='gb-deco-icon-error' />
        </DecoErrorContainer>
        {children}
      </>
    )
})
