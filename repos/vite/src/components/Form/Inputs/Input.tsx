import type { TInputDecor } from '@types'
import type { ComponentProps, CSSProperties } from 'react'
import type { InputLabelProps, InputProps } from '@mui/material'

import { Decor } from './Decor'
import { noOpObj } from '@keg-hub/jsutils'
import { TextFieldElement } from 'react-hook-form-mui'

export type TInput =  ComponentProps<typeof TextFieldElement> & {
  active?:boolean
  sx?: CSSProperties
  decor?: TInputDecor
  gridProps?:Record<any, any>
}

export const Input = (props:TInput) => {
  const {
    sx,
    active,
    gridProps,
    decor=noOpObj as TInputDecor,
    InputProps=noOpObj as InputProps,
    InputLabelProps=noOpObj as InputLabelProps,
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
      } as InputLabelProps}
      {...rest}
    />
  )
}
