import type { ComponentProps } from 'react'
import { AutocompleteElement } from 'react-hook-form-mui'

export type TAutoInput = ComponentProps<typeof AutocompleteElement> & {
  disabled?: boolean
}


export const AutoInput = (props:TAutoInput) => {
  const { disabled, ...rest } = props

  return (
    <AutocompleteElement {...rest} autocompleteProps={{ disabled }} />
  )
}