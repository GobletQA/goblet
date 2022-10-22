import type { ComponentProps } from 'react'
import type { InputProps } from '@mui/material'
import type { InputDecor, CssProps } from '@types'

import { Decor } from './Decor'
import { noOpObj } from '@keg-hub/jsutils'
import { TextFieldElement } from 'react-hook-form-mui'

export type TInput =  ComponentProps<typeof TextFieldElement> & {
  decor?: InputDecor
  sx?: CssProps
}

export const Input = (props:TInput) => {
  const {
    sx,
    decor=noOpObj as InputDecor,
    InputProps=noOpObj as InputProps,
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
      {...rest}
    />
  )
}
