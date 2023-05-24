import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { DecoSpinIcon, DecoSpinContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  children:ReactNode
  sx?:CSSProperties
}

export const DecoSpin = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props
  const { className, glyphMarginClassName  } = deco.options

    return (
      <>
        <DecoSpinContainer
          {...rest}
          ref={ref}
          className={`gb-deco-icon-spin-container ${className}`}
        >
          <DecoSpinIcon className={`gb-deco-icon-spin ${glyphMarginClassName}`} />
        </DecoSpinContainer>
        {children}
      </>
    )
})
