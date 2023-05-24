import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'


import { forwardRef } from 'react'
import { DecoPassIcon, DecoSuccessContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  children:ReactNode
  sx?:CSSProperties
}

export const DecoSuccess = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props

    return (
      <>
        <DecoSuccessContainer
          {...rest}
          ref={ref}
          className='gb-deco-icon-success-container'
        >
          <DecoPassIcon className='gb-deco-icon-success' />
        </DecoSuccessContainer>
        {children}
      </>
    )
})


