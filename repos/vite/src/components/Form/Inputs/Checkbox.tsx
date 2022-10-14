import type { ComponentProps } from 'react'
import { CheckboxElement } from 'react-hook-form-mui'

export type TCheckbox = ComponentProps<typeof CheckboxElement> & {
  
}

export const Checkbox = (props:TCheckbox) => {
  const { ...rest } = props

  return (
    <CheckboxElement {...rest} />
  )
}