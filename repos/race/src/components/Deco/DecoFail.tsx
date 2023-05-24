import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode } from 'react'

import { forwardRef } from 'react'
import { DecoFailIcon, DecoFailContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  children:ReactNode
}


export const DecoFail = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props

    return (
      <>
        <DecoFailContainer
          {...rest}
          ref={ref}
          className='gb-deco-icon-fail-container'
        >
          <DecoFailIcon className='gb-deco-icon-fail' />
        </DecoFailContainer>
        {children}
      </>
    )
})
