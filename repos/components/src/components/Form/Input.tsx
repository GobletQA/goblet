
import type { InputProps } from '@mui/material'
import type { TInputAction } from './InputActions'
import type { CSSProperties, ReactNode, ChangeEvent } from 'react'

import { InputActions } from './InputActions'
import { useEdit } from '@GBC/hooks/form/useEdit'
import { cls, capitalize, uuid } from '@keg-hub/jsutils'
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
  size?:`medium`|`small`
  InputProps?:InputProps
  labelSx?:CSSProperties
  inputSx?:CSSProperties
  actions?:TInputAction[]
  initialEditing?:boolean
  value?:string|boolean|number
  onToggleEdit?:(evt:ChangeEvent<T>, value:boolean) => void
  onChange?:(evt:ChangeEvent<T>, value:string|boolean|number) => void
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
}

export const Input = (props:TInput<HTMLInputElement | HTMLTextAreaElement>) => {
  const {
    name,
    type,
    color,
    label,
    actions,
    inputSx,
    labelSx,
    disabled,
    children,
    required,
    className,
    fullWidth,
    multiline,
    helperText,
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
      {!editing
        ? children
        : (
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
                  disabled={disabled}
                  required={required}
                  inputRef={inputRef}
                  onChange={onChange}
                  color={color as any}
                  fullWidth={fullWidth}
                  multiline={multiline}
                  InputProps={InputProps}
                  error={Boolean(error.length)}
                  helperText={error || helperText}
                  placeholder={placeholder || "Enter some text..."}
                  className={cls('gc-text-input', className && `${className}-input`)}
                />
              </TextInputContainer>
            </TextInputControl>
          )
      }
      <InputActions
        label={label}
        editing={editing}
        actions={actions}
        onToggleEdit={onToggleEdit}
      />
    </InputContainer>
  )

}