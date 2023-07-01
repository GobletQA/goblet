import type { CSSProperties, ComponentProps } from 'react'
import { TextFieldProps } from '@mui/material'

import {
  WrapInputLabel,
  InputLabelShared,
} from './Inputs.styled'

import { cls } from '@keg-hub/jsutils'

export type TInputLabel = {
  id?:string
  labelId?:string
  labelSide?:boolean
  labelClass?:string
  labelInline?:boolean
  labelSx?: CSSProperties
  labelWrapSx?: CSSProperties
  label?:TextFieldProps['label']
}


export const InputLabel = (props:TInputLabel) => {
  const {
    id,
    label,
    labelSx,
    labelId,
    labelSide,
    labelClass,
    labelWrapSx,
    labelInline,
  } = props
  
  if(labelInline || !label) return null

  return (
    <WrapInputLabel
      sx={labelWrapSx}
      className={cls(
        labelClass && `${labelClass}-wrap`,
        !labelSide && `gb-label-wrap`,
        labelInline && `gb-label-wrap-inline`,
        labelSide && `gb-label-wrap-side`
      )}
    >
      <InputLabelShared
        id={labelId}
        htmlFor={id}
        sx={labelSx}
        shrink={false}
        className={cls(
          labelClass,
          !labelSide && `gb-input-label`,
          labelInline && `gb-label-inline`,
          labelSide && `gb-label-side`
        )}
      >
        {label}
      </InputLabelShared>
    </WrapInputLabel>
  )
}