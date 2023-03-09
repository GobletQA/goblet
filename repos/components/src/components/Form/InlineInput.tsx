
import type { TChangeCB } from '@GBC/types'
import type { InputProps } from '@mui/material'
import type { RefObject, CSSProperties } from 'react'

import { cls, uuid } from '@keg-hub/jsutils'
import { useInputCallbacks } from '@GBC/hooks/form/useInputCallbacks'

import {
  TextInput,
  TextLabelWrap,
  TextInputLabel,
  InputContainer,
  TextInputControl,
  TextInputContainer,
} from './Form.styled'

export type TInlineInput<T> = {
  id?:string
  label:string
  name?:string
  type?:string
  className?:string
  disabled?:boolean
  required?:boolean
  fullWidth?:boolean
  multiline?:boolean
  placeholder?:string
  helperText?: string
  onBlur?:TChangeCB
  onChange?:TChangeCB
  size?:`medium`|`small`
  InputProps?:InputProps
  labelSx?:CSSProperties
  inputSx?:CSSProperties
  initialEditing?:boolean
  changeFromBlur?:boolean
  value?:string|boolean|number
  inputProps?:Record<string, any>
  variant?:`outlined`|`filled`|`standard`
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
}

export const InlineInput = (props:TInlineInput<HTMLInputElement | HTMLTextAreaElement>) => {
  const {
    name,
    type,
    color,
    label,
    variant,
    inputSx,
    labelSx,
    disabled,
    required,
    className,
    fullWidth,
    multiline,
    helperText,
    inputProps,
    InputProps,
    placeholder,
    changeFromBlur,
    initialEditing,
    id=uuid(),
    size=`small`,
  } = props

  const {
    error,
    onBlur,
    onChange,
    inputRef,
    onKeyDown,
  } = useInputCallbacks<HTMLInputElement | HTMLTextAreaElement>({
    required,
    changeFromBlur,
    onBlur: props.onBlur,
    value: props.value || ``,
    onChange: props.onChange,
    inputRef: props.inputRef,
    initialEditing: initialEditing,
  })

  return (
    <InputContainer
      className={cls(
        `gc-input-root gc-input-container`,
        `editing-input`
      )}
    >
      <TextInputControl>
        <TextInputContainer className='gc-text-input-container' >
          {label && (
            <TextLabelWrap className='gc-text-input-label-wrap' >
              <TextInputLabel
                htmlFor={id}
                sx={labelSx}
                shrink={false}
                className={cls('gc-text-input-label', className && `${className}-input-label`)}
              >
                {label}
              </TextInputLabel>
            </TextLabelWrap>
          ) || null}
          <TextInput
            id={id}
            type={type}
            size={size}
            name={name}
            sx={inputSx}
            required={required}
            inputRef={inputRef}
            inputProps={{
              ...inputProps,
              disabled,
              onBlur:onBlur,
              onChange:onChange,
              onKeyDown: onKeyDown,
            }}
            disabled={disabled}
            color={color as any}
            fullWidth={fullWidth}
            multiline={multiline}
            InputProps={InputProps}
            error={Boolean(error.length)}
            variant={variant || `standard`}
            helperText={error || helperText}
            defaultValue={props.value || ``}
            placeholder={placeholder || "Enter some text..."}
            className={cls('gc-text-input', className && `${className}-input`)}
          />
        </TextInputContainer>
      </TextInputControl>

    </InputContainer>
  )

}