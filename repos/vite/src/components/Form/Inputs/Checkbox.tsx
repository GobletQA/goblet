import type { ComponentProps } from 'react'
import { CheckboxElement } from './CheckboxElement'

export type TCheckbox = ComponentProps<typeof CheckboxElement> & {
  labelPos?: `top`|`bottom`|`left`|`right` 
}

export const Checkbox = (props:TCheckbox) => {
  const { ...rest } = props

  return (
    <CheckboxElement {...rest} />
  )
}