import type { ComponentProps } from 'react'
import {
  InputText,
  InputLabel,
  InputLabelWrap,
  InputContainer,
} from './Inputs.styled'

export type TInput = Omit<ComponentProps<typeof InputText>, `error`> & {
  error?:string
  labelInline?:boolean
}

export const Input = (props:TInput) => {
  const {
    error,
    label,
    helperText,
    labelInline,
    ...rest
  } = props

  return (
    <InputContainer>
      {!labelInline && label && (
        <InputLabelWrap>
          <InputLabel>
            {label}
          </InputLabel>
        </InputLabelWrap>
      )|| null}
      <InputText
        fullWidth
        error={!!error}
        helperText={error ? error : helperText || ` `}
        label={labelInline && label ? label : undefined}
        {...rest}
      />
    </InputContainer>
  )
  
}