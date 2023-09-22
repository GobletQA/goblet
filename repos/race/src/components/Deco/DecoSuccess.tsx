import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'


import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoPassIcon, DecoSuccessContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  className?:string
  children:ReactNode
  sx?:CSSProperties
}

export const DecoSuccess = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, className, children, ...rest } = props

    return (
      <>
        <DecoSuccessContainer
          {...rest}
          ref={ref}
          className={cls(`gb-deco-icon-success-container`, className)}
        >
          <DecoPassIcon className='gb-deco-icon-success' />
        </DecoSuccessContainer>
        {children}
      </>
    )
})


