import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import {cls} from '@keg-hub/jsutils'
import { DecoPassIcon, DecoPassContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  sx?:CSSProperties
  className?:string
  children?:ReactNode
}
export const DecoPass = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, className, ...rest } = props

    return (
      <>
        <DecoPassContainer
          {...rest}
          ref={ref}
          className={cls(`gb-deco-icon-pass-container`, className)}
        >
          <DecoPassIcon className='gb-deco-icon-pass' />
        </DecoPassContainer>
        {children}
      </>
    )
})
