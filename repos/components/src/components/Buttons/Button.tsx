import type { ComponentProps } from 'react'

import MuiButton from '@mui/material/Button'

export type TButton = ComponentProps<typeof MuiButton> & {}

export const Button = (props:TButton) => {
  const {
     children,
     ...rest
  } = props

  return (
    <MuiButton {...rest} >
      {children}
    </MuiButton>
  )
}