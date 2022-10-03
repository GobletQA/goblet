import type { ComponentProps, ReactNode } from 'react'
import MuiButton from '@mui/material/Button'

export type TButton = ComponentProps<typeof MuiButton>


export const Button = (props:TButton) => {
  return (<MuiButton {...props} />)
}

