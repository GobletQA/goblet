import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import {cls} from '@keg-hub/jsutils'
import { DecoCanceledIcon, DecoCanceledContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  iconClass?:string
  sx?:CSSProperties
  className?:string
  children?:ReactNode
}
export const DecoCanceled = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, iconClass, className, ...rest } = props

    return (
      <>
        <DecoCanceledContainer
          {...rest}
          ref={ref}
          className={cls(
            className,
            `gb-deco-icon-container`,
            `gb-deco-icon-canceled-container`,
          )}
        >
          <DecoCanceledIcon
            className={cls(
              iconClass,
              `gb-deco-icon`,
              `gb-deco-icon-canceled`
            )}
          />
        </DecoCanceledContainer>
        {children}
      </>
    )
})
