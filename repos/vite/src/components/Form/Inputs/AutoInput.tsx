import type { TInputDecor } from '@types'
import type { ComponentProps } from 'react'
import type { InputProps, InputLabelProps } from '@mui/material'

import { Decor } from './Decor'
import { noOpObj } from '@keg-hub/jsutils'
import { AutocompleteElement } from './AutocompleteElement'

export type TAutoInput = ComponentProps<typeof AutocompleteElement> & {
  decor?: TInputDecor
  disabled?: boolean
}

const isOptionEqualToValue = (option:any, value:any) => option?.value === value?.value

export const AutoInput = (props:TAutoInput) => {
  const {
    disabled,
    textFieldProps,
    decor=noOpObj as TInputDecor,
    ...rest
  } = props
  const { Component, pos } = decor
  const decorKey = pos === `end` ? `endAdornment` : `startAdornment`

  return (
    <AutocompleteElement
      {...rest}
      autocompleteProps={{
        disabled,
        isOptionEqualToValue
      }}
      textFieldProps={{
        ...textFieldProps,
        InputProps: {
          ...(Component && {
            [decorKey]: (
              <Decor
                {...decor}
                Component={Component}
              />
            )
          }),
          ...(textFieldProps?.InputProps || noOpObj),
        } as InputProps,
        InputLabelProps: {
          shrink: true,
          ...(textFieldProps?.InputLabelProps || noOpObj),
        } as InputLabelProps
      }}
    />
  )
}