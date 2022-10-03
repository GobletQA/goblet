import type { ComponentProps } from 'react'
import MuiInput from '@mui/material/Input'

import { Input } from './Input'

export type TTextArea = ComponentProps<typeof Input>

export const TextArea = (props:TTextArea) => {
  return (<Input {...props} multiline />)
}
