import type { CSSProperties, ComponentProps } from 'react'
import type { TInputDecor } from '@GBC/types'
import {
  InputText,
  InputContainer,
} from './Inputs.styled'

import { InputLabel } from './InputLabel'
import { cls } from '@keg-hub/jsutils'
import { useEdit } from '@GBC/hooks/form/useEdit'

export type TInput = Omit<ComponentProps<typeof InputText>, `error`> & {
  id?: string
  name?: string
  error?:string
  matchId?: boolean
  required?: boolean
  multiple?: boolean
  disabled?: boolean
  decor?: TInputDecor
  className?:string
  labelSide?:boolean
  labelInline?:boolean
  inputSx?: CSSProperties
  labelSx?: CSSProperties
  labelWrapSx?: CSSProperties
  value?:string|boolean|number
  variant?:`outlined`|`filled`|`standard`
}


export const Input = (props:TInput) => {
  const {
    id,
    error,
    value,
    decor,
    matchId,
    required,
    disabled,
    inputSx,
    label,
    color,
    labelSx,
    labelSide,
    labelWrapSx,
    className,
    helperText,
    labelInline,
    variant,
    inputProps,
    placeholder,
    multiline,
    fullWidth=true,
    InputProps,
    ...rest
  } = props

  const {
    onBlur,
    inputRef,
    onKeyDown,
    error: inputErr
  } = useEdit<HTMLInputElement | HTMLTextAreaElement>({
    required,
    value: props.value || ``,
    onChange: props.onChange,
  })

  return (
    <InputContainer
      className={cls(
        `gc-input-root`,
        `gc-input-container`,
        labelSide && `gc-input-container-side`
      )}
    >
      <InputLabel
        id={id}
        label={label}
        labelSx={labelSx}
        labelSide={labelSide}
        labelInline={labelInline}
        labelWrapSx={labelWrapSx}
      />
      <InputText
        id={id}
        sx={inputSx}
        variant={variant}
        inputRef={inputRef}
        required={required}
        disabled={disabled}
        color={color as any}
        fullWidth={fullWidth}
        multiline={multiline}
        InputProps={InputProps}
        defaultValue={props.value || ``}
        className={cls(`gc-input`, className)}
        error={Boolean(error?.length || inputErr)}
        label={labelInline && label ? label : undefined}
        placeholder={placeholder || "Enter some text..."}
        helperText={error ? error : inputErr || helperText || ` `}
        inputProps={{
          ...inputProps,
          onBlur: onBlur,
          disabled: disabled,
          onKeyDown: onKeyDown
        }}
        {...rest}
      />
    </InputContainer>
  )
  
}