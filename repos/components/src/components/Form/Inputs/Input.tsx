import type { CSSProperties, ComponentProps, RefObject } from 'react'
import type { TInputDecor } from '@GBC/types'
import {
  InputText,
  InputContainer,
} from './Inputs.styled'

import { Decor } from './Decor'
import { InputLabel } from './InputLabel'
import { cls, emptyObj } from '@keg-hub/jsutils'
import { useInputCallbacks } from '@GBC/hooks/form/useInputCallbacks'

export type TInput = Omit<ComponentProps<typeof InputText>, `error`|`inputRef`> & {
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
  inputRef?:RefObject<HTMLInputElement | HTMLTextAreaElement | undefined>
}

export const Input = (props:TInput) => {
  const {
    id,
    error,
    value,
    label,
    color,
    matchId,
    variant,
    labelSx,
    inputSx,
    required,
    disabled,
    labelSide,
    className,
    multiline,
    autoFocus,
    helperText,
    InputProps,
    inputProps,
    labelWrapSx,
    labelInline,
    placeholder,
    fullWidth=true,
    onBlur:onBlurIn,
    onFocus:onFocusIn,
    inputRef:inputRefIn,
    onChange:onChangeIn,
    onKeyDown:onKeyDownIn,
    decor=emptyObj as TInputDecor,
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
    autoFocus,
    onBlur: onBlurIn,
    onFocus: onFocusIn,
    onChange: onChangeIn,
    inputRef: inputRefIn,
    onKeyDown: onKeyDownIn,
    value: props.value || ``,
  })

  const { Component:DecorComponent, decorPos=`start` } = decor
  const decorKey = decorPos === `end` ? `endAdornment` : `startAdornment`

  return (
    <InputContainer
      className={cls(
        `gb-input-root`,
        `gb-input-container`,
        labelSide && `gb-input-container-side`
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
        className={cls(`gb-input`, className)}
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