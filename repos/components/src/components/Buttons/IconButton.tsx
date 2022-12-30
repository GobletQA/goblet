import type { ForwardedRef, ComponentProps, ComponentType } from 'react'

import { forwardRef } from 'react'
import MuiIconBtn from '@mui/material/IconButton'

export type TIconButton = ComponentProps<typeof MuiIconBtn> & {
  Icon?: ComponentType<any>
}

export const IconButton = forwardRef((props:TIconButton, ref:ForwardedRef<HTMLButtonElement>) => {
  const {
    Icon,
     children,
     ...rest
  } = props

  return (
    <MuiIconBtn ref={ref} {...rest} >
      {Icon ? <Icon /> : children}
    </MuiIconBtn>
  )
})