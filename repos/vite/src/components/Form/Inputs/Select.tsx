import type { ComponentProps } from 'react'
import { SelectElement } from 'react-hook-form-mui'

export type TSelect = ComponentProps<typeof SelectElement> & {
  
}

export const Select = (props:TSelect) => {
  const { ...rest } = props
  return (
    <SelectElement {...rest} />
  )
}