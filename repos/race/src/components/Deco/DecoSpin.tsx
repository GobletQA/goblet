import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoSpinIcon, DecoSpinContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  sx?:CSSProperties
  iconClass?:string
  className?:string
  children?:ReactNode
}

export const DecoSpin = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const {
    deco,
    children,
    iconClass,
    ...rest
  } = props
  const { className, glyphMarginClassName  } = (deco?.options || {})

    return (
      <>
        <DecoSpinContainer
          {...rest}
          ref={ref}
          className={cls(
            className,
            props.className,
            `gb-deco-icon-container`,
            `gb-deco-icon-spin-container`,
          )}
        >
          <DecoSpinIcon
            className={cls(
              iconClass,
              glyphMarginClassName,
              `gb-deco-icon gb-deco-icon-spin`
            )}
          />
        </DecoSpinContainer>
        {children}
      </>
    )
})
