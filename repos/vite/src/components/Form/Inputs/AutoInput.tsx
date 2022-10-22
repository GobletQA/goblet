import type { InputDecor } from '@types'
import type { ComponentProps } from 'react'
import type { InputProps } from '@mui/material'

import { Decor } from './Decor'
import { noOpObj } from '@keg-hub/jsutils'
import { AutocompleteElement } from 'react-hook-form-mui'

export type TAutoInput = ComponentProps<typeof AutocompleteElement> & {
  decor?: InputDecor
  disabled?: boolean
}

export const AutoInput = (props:TAutoInput) => {
  const {
    disabled,
    textFieldProps,
    decor=noOpObj as InputDecor,
    ...rest
  } = props
  const { Component, pos } = decor
  const decorKey = pos === `end` ? `endAdornment` : `startAdornment`

  return (
    <AutocompleteElement
      {...rest}
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
        } as InputProps
      }}
      autocompleteProps={{ disabled }}
    />
  )
}