import type { CSSProperties, ComponentProps } from 'react'
import { TextFieldProps } from '@mui/material'

import {
  WrapInputLabel,
  InputLabelShared,
} from './Inputs.styled'

import { cls } from '@keg-hub/jsutils'

type TInputLabel = {
  id?:string
  labelSide?:boolean
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
    labelSide,
    labelWrapSx,
    labelInline,
  } = props
  
  if(labelInline || !label) return null

  return (
    <WrapInputLabel
      sx={labelWrapSx}
      className={cls(
        !labelSide && `gc-label-wrap`,
        labelInline && `gc-label-wrap-inline`,
        labelSide && `gc-label-wrap-side`
      )}
    >
      <InputLabelShared
        htmlFor={id}
        sx={labelSx}
        shrink={false}
        className={cls(
          !labelSide && `gc-input-label`,
          labelInline && `gc-label-inline`,
          labelSide && `gc-label-side`
        )}
      >
        {label}
      </InputLabelShared>
    </WrapInputLabel>
  )
}