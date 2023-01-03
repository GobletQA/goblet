
import type { InputProps } from '@mui/material'
import type { TInputAction } from './InputActions'
import type { TToggleEditCB, TChangeCB } from '@GBC/types'
import type { CSSProperties, ReactNode, ChangeEvent, KeyboardEvent } from 'react'

import { InputActions } from './InputActions'
import { useEdit } from '@GBC/hooks/form/useEdit'
import { cls, uuid } from '@keg-hub/jsutils'
import {
  TextInput,
  TextLabelWrap,
  TextInputLabel,
  InputContainer,
  TextInputControl,
  TextInputContainer,
} from './Form.styled'

export type TInput<T> = {
  id?:string
  label:string
  name?:string
  type?:string
  disabled?:boolean
  required?:boolean
  fullWidth?:boolean
  className?:string
  children:ReactNode
  multiline?:boolean
  placeholder?:string
  helperText?: string
  onChange?:TChangeCB
  size?:`medium`|`small`
  InputProps?:InputProps
  labelSx?:CSSProperties
  inputSx?:CSSProperties
  actions?:TInputAction[]
  initialEditing?:boolean
  onToggleEdit?:TToggleEditCB
  value?:string|boolean|number
  inputProps?:Record<string, any>
  variant?:`outlined`|`filled`|`standard`
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
}

export const Input = (props:TInput<HTMLInputElement | HTMLTextAreaElement>) => {
  const {
    name,
    type,
    color,
    label,
    variant,
    actions,
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
    initialEditing,
    id=uuid(),
    size=`small`,
  } = props

  const {
    value,
    error,
    editing,
    inputRef,
    onChange,
    onKeyDown,
    onToggleEdit,
  } = useEdit<HTMLInputElement | HTMLTextAreaElement>({
    required,
    value: props.value || ``,
    onChange: props.onChange,
    initialEditing: initialEditing,
    onToggleEdit: props.onToggleEdit,
  })

  return (
    <InputContainer className='gc-input-root gc-input-container' >
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
            value={value}
            required={required}
            inputRef={inputRef}
            onChange={onChange}
            inputProps={{
              ...inputProps,
              onKeyDown: onKeyDown
            }}
            color={color as any}
            fullWidth={fullWidth}
            multiline={multiline}
            InputProps={InputProps}
            error={Boolean(error.length)}
            variant={variant || `standard`}
            disabled={!editing || disabled}
            helperText={error || helperText}
            placeholder={placeholder || "Enter some text..."}
            className={cls('gc-text-input', className && `${className}-input`)}
          />
        </TextInputContainer>
      </TextInputControl>

      <InputActions
        label={label}
        editing={editing}
        actions={actions}
        onToggleEdit={onToggleEdit}
      />
    </InputContainer>
  )

}