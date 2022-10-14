import type { ComponentProps } from 'react'
import { MultiSelectElement } from 'react-hook-form-mui'

export type TMultiSelect = ComponentProps<typeof MultiSelectElement> & {
  
}

export const MultiSelect = (props:TMultiSelect) => {
  const { ...rest } = props
  return (
    <MultiSelectElement {...rest} />
  )
}