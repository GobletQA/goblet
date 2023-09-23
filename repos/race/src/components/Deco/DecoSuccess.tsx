import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'


import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoPassIcon, DecoSuccessContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  iconClass?:string
  className?:string
  children:ReactNode
  sx?:CSSProperties
}

export const DecoSuccess = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, iconClass, className, children, ...rest } = props

    return (
      <>
        <DecoSuccessContainer
          {...rest}
          ref={ref}
          className={cls(
            className,
            `gb-deco-icon-container`,
            `gb-deco-icon-success-container`,
          )}
        >
          <DecoPassIcon
            className={cls(
              iconClass,
              `gb-deco-icon gb-deco-icon-success`
            )}
          />
        </DecoSuccessContainer>
        {children}
      </>
    )
})


