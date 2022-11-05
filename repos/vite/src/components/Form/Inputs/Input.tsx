import type { ComponentProps } from 'react'
import type { TInputDecor, CssProps } from '@types'
import type { InputProps, InputLabelProps } from '@mui/material'

import { Decor } from './Decor'
import { noOpObj } from '@keg-hub/jsutils'
import { TextFieldElement } from 'react-hook-form-mui'

export type TInput =  ComponentProps<typeof TextFieldElement> & {
  decor?: TInputDecor
  sx?: CssProps
}

export const Input = (props:TInput) => {
  const {
    sx,
    active,
    gridProps,
    Component:__,
    decor=noOpObj as TInputDecor,
    InputProps=noOpObj as InputProps,
    InputLabelProps=noOpObj as InputProps,
    ...rest
  } = props
  const { Component, pos } = decor
  const decorKey = pos === `end` ? `endAdornment` : `startAdornment`

  return (
    <TextFieldElement
      sx={[{ width: `100%` }, sx]}
      InputProps={{
        ...(Component && {
          [decorKey]: (
            <Decor
              {...decor}
              Component={Component}
            />
          )
        }  as InputProps),
        ...InputProps,
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...rest}
    />
  )
}
