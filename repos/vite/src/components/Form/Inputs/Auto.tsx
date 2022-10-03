import type { ComponentProps, ReactNode } from 'react'
import type { AutocompleteRenderInputParams } from '@mui/material'
import { noPropArr } from '@keg-hub/jsutils'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export type TAutoOps = string[] | { label: string, id: number } | unknown[]

export type TAuto = Omit<ComponentProps<typeof Autocomplete>, 'renderInput' | 'options'> & {
  inputProps?: ComponentProps<typeof TextField>
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode
  options?: TAutoOps
}

export const Auto = (props:TAuto) => {
  const {
    inputProps,
    options=noPropArr as TAutoOps,
    ...rest
  } = props
  
  return (
    <Autocomplete
      options={options as unknown[]}
      renderInput={(params) => <TextField {...inputProps} {...params} />}
      {...rest}
    />
  )
}
