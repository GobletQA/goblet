import type { ComponentProps } from 'react'
import { AutocompleteElement } from 'react-hook-form-mui'

export type TAutoInput = ComponentProps<typeof AutocompleteElement> & {
  
}


export const AutoInput = (props:TAutoInput) => {
  const { ...rest } = props

  return (
    <AutocompleteElement {...rest} />
  )
}