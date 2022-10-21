import type { ReactNode, ComponentProps } from 'react'

import IconButton from '@mui/material/IconButton'
import MuiButton from '@mui/material/Button'

export type TMuiButton = ComponentProps<typeof MuiButton> & {
  
}

export type TIconButton = ComponentProps<typeof IconButton> & {
  icon?: ReactNode
}

type TBothButtons = TIconButton | TMuiButton

export type TButton = TBothButtons & {
  icon?: ReactNode
}

const Btn = (props:TMuiButton) => {
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

const IconBtn = (props:TIconButton) => {
  const {
    icon,
     children,
     ...rest
  } = props
  
  
  return (
    <IconButton {...rest} >
      { icon || children}
    </IconButton>
  )
}

export const Button = ({ icon, ...props }:TButton) => {
  return icon
    ? <IconBtn {...(props as TIconButton)} icon={icon} />
    : <Btn {...(props as TMuiButton)} />
}