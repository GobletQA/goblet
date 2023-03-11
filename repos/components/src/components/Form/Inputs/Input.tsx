import type { CSSProperties, ComponentProps } from 'react'
import type { TInputDecor } from '@GBC/types'
import {
  InputText,
  InputContainer,
} from './Inputs.styled'

import { Decor } from './Decor'
import { InputLabel } from './InputLabel'
import { cls, emptyObj } from '@keg-hub/jsutils'
import { useInputCallbacks } from '@GBC/hooks/form/useInputCallbacks'

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
    decor=emptyObj as TInputDecor,
    onBlur:onBlurIn,
    onFocus:onFocusIn,
    onChange:onChangeIn,
    onKeyDown:onKeyDownIn,
    ...rest
  } = props

  const {
    onBlur,
    onFocus,
    inputRef,
    onKeyDown,
    error: inputErr
  } = useInputCallbacks({
    required,
    onBlur: onBlurIn,
    onFocus: onFocusIn,
    onChange: onChangeIn,
    onKeyDown: onKeyDownIn,
    value: props.value || ``,
  })

  const { Component:DecorComponent, decorPos=`start` } = decor
  const decorKey = decorPos === `end` ? `endAdornment` : `startAdornment`

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
        InputProps={{
          ...InputProps,
          ...(DecorComponent && {
            [decorKey]: (
              <Decor
                {...decor}
                Component={DecorComponent}
              />
            )
          }),
        }}
        defaultValue={props.value || ``}
        className={cls(`gc-input`, className)}
        error={Boolean(error?.length || inputErr)}
        label={labelInline && label ? label : undefined}
        placeholder={placeholder || "Enter some text..."}
        helperText={error ? error : inputErr || helperText || ` `}
        inputProps={{
          ...inputProps,
          onBlur: onBlur,
          onFocus: onFocus,
          disabled: disabled,
          onKeyDown: onKeyDown
        }}
        {...rest}
      />
    </InputContainer>
  )
  
}