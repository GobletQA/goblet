import type { TRaceDeco } from '@GBR/types'
import type { ForwardedRef, ReactNode, CSSProperties } from 'react'

import { forwardRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoFailIcon, DecoFailContainer } from './Deco.styled'

export type TDeco = {
  deco?:TRaceDeco
  className?:string
  children?:ReactNode
  sx?:CSSProperties
}


export const DecoFail = forwardRef((props:TDeco, ref:ForwardedRef<any>) => {
  const { deco, children, className, ...rest } = props

    return (
      <>
        <DecoFailContainer
          {...rest}
          ref={ref}
          className={cls('gb-deco-icon-fail-container', className)}
        >
          <DecoFailIcon className='gb-deco-icon-fail' />
        </DecoFailContainer>
        {children}
      </>
    )
})
