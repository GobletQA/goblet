import type { ReactNode, ComponentProps } from 'react'
import MuiIconBtn from '@mui/material/IconButton'

export type TIconButton = ComponentProps<typeof MuiIconBtn> & {
}

export const IconButton = (props:TIconButton) => {
  const {
     children,
     ...rest
  } = props

  return (
    <MuiIconBtn {...rest} >
      { children}
    </MuiIconBtn>
  )
}