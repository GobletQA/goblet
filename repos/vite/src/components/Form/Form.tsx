import type { ComponentProps, ReactNode } from 'react'
import Box from '@mui/material/Box'

export type TForm = ComponentProps<typeof Box>

export const Form = (props:TForm) => {
  return (<Box component="form" sx={{ flexGrow: 1 }} {...props} />)
}