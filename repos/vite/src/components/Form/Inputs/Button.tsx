import { Button as MuiButton } from '@mui/material'
import type { ComponentProps } from 'react'

export type TButton = ComponentProps<typeof MuiButton> & {
  
}

export const Button = (props:TButton) => {
  const {
     children,
     ...rest
  } = props
  
  
  return (
    <Button {...rest} >
      {children}
    </Button>
  )
}