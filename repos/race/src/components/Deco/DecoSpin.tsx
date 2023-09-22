import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoSpinIcon, DecoSpinContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  sx?:CSSProperties
  className?:string
  children?:ReactNode
}

export const DecoSpin = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, ...rest } = props
  const { className, glyphMarginClassName  } = (deco?.options || {})

    return (
      <>
        <DecoSpinContainer
          {...rest}
          ref={ref}
          className={cls(`gb-deco-icon-spin-container`, className, props.className)}
        >
          <DecoSpinIcon className={`gb-deco-icon-spin ${glyphMarginClassName}`} />
        </DecoSpinContainer>
        {children}
      </>
    )
})
