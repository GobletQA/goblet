import type { ComponentProps, ComponentType } from 'react'
import MuiIconBtn from '@mui/material/IconButton'

export type TIconButton = ComponentProps<typeof MuiIconBtn> & {
  Icon?: ComponentType<any>
}

export const IconButton = (props:TIconButton) => {
  const {
    Icon,
     children,
     ...rest
  } = props

  return (
    <MuiIconBtn {...rest} >
      {Icon ? <Icon /> : children}
    </MuiIconBtn>
  )
}