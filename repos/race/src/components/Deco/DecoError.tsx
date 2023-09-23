import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoFailIcon, DecoErrorContainer } from './Deco.styled'

export type TDeco = {
  deco:TRaceDeco
  className?:string
  children:ReactNode
  sx?:CSSProperties
}

export const DecoError = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, className, children, ...rest } = props

    return (
      <>
        <DecoErrorContainer
          {...rest}
          ref={ref}
          className={cls(
            className,
            `gb-deco-icon-container`,
            `gb-deco-icon-error-container`,
          )}
        >
          <DecoFailIcon className='gb-deco-icon gb-deco-icon-error' />
        </DecoErrorContainer>
        {children}
      </>
    )
})
