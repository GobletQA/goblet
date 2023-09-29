import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoFailIcon, DecoFailContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  iconClass?:string
  className?:string
  children?:ReactNode
  sx?:CSSProperties
}


export const DecoFail = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, iconClass, className, ...rest } = props

    return (
      <>
        <DecoFailContainer
          {...rest}
          ref={ref}
          className={cls(
            className,
            `gb-deco-icon-container`,
            `gb-deco-icon-fail-container`,
          )}
        >
          <DecoFailIcon
            className={cls(
              iconClass,
              `gb-deco-icon gb-deco-icon-fail`
            )}
          />
        </DecoFailContainer>
        {children}
      </>
    )
})
