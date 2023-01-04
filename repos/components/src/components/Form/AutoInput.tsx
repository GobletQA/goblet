import type { InputProps } from '@mui/material'
import type { TInputAction } from './InputActions'
import type { CSSProperties, ComponentProps } from 'react'
import type { TToggleEditCB, TChangeCB, TInputValue } from '@GBC/types'

import { InputActions } from './InputActions'
import { useEdit } from '@GBC/hooks/form/useEdit'
import { useControlValue } from '@GBC/hooks/form/useControlValue'
import { cls, uuid, emptyArr } from '@keg-hub/jsutils'
import {
  TextInput,
  TextAutoComp,
  TextLabelWrap,
  TextInputLabel,
  InputContainer,
  TextInputControl,
  TextInputContainer,
} from './Form.styled'


export type TAutoInput = Omit<
  ComponentProps<typeof TextAutoComp>,
  `renderInput`|`options`
> & {
  id?:string
  name?:string
  type?:string
  label?:string
  className?:string
  fullWidth?:boolean
  options?:string[]
  disabled?:boolean
  required?:boolean
  isError?: boolean
  value:TInputValue
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
  inputProps?:Record<string, any>
  onToggleEdit?:TToggleEditCB
  variant?:`outlined`|`filled`|`standard`
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
}



export const AutoInput = (props:TAutoInput) => {
  const {
    name,
    type,
    label,
    color,
    actions,
    inputSx,
    labelSx,
    isError,
    variant,
    disabled,
    required,
    multiline,
    className,
    helperText,
    placeholder,
    fullWidth,
    inputProps,
    InputProps,
    initialEditing,
    options=emptyArr,
    id=uuid(),
    size=`small`,
    ...rest
  } = props

  const [value, setValue] = useControlValue(props)

  const {
    error,
    editing,
    inputRef,
    onClick,
    onChange,
    onKeyDown,
    onToggleEdit,
  } = useEdit<HTMLInputElement | HTMLTextAreaElement>({
    required,
    setValue,
    controlled: true,
    value:props.value,
    onChange: props.onChange,
    initialEditing: initialEditing,
    onToggleEdit: props.onToggleEdit,
  })

  return (
    <InputContainer
      onClick={onClick}
      className={cls(
        `gc-auto-input-root gc-auto-input-container`,
        editing ? `editing-input` : `disabled-input`
      )}
    >
      <TextInputControl>
        <TextInputContainer className='gc-auto-input-container' >
          {label && (
            <TextLabelWrap className='gc-auto-input-label-wrap' >
              <TextInputLabel
                htmlFor={id}
                sx={labelSx}
                shrink={false}
                className={cls('gc-auto-input-label', className && `${className}-input-label`)}
              >
                {label}
              </TextInputLabel>
            </TextLabelWrap>
          ) || null}

          <TextAutoComp
            freeSolo
            size='small'
            options={options}
            className={cls('gc-auto-input', className)}
            {...rest}
            renderInput={({ inputProps, ...params}) => {
              return (
                <TextInput
                  {...params}
                  name={name}
                  sx={inputSx}
                  required={required}
                  inputRef={inputRef}
                  onChange={onChange}
                  color={color as any}
                  id={params.id || id}
                  multiline={multiline}
                  value={value || ``}
                  size={params.size || size}
                  error={Boolean(error.length)}
                  variant={variant || `standard`}
                  helperText={error || helperText}
                  InputLabelProps={params.InputLabelProps}
                  fullWidth={params.fullWidth || fullWidth}
                  placeholder={placeholder || "Select an option..."}
                  disabled={!editing || disabled || params.disabled}
                  InputProps={{ ...InputProps, ...params.InputProps }}
                  className={cls('gc-text-input', className && `${className}-auto-input`)}
                  inputProps={{
                    ...inputProps,
                    ...inputProps,
                    onKeyDown: onKeyDown
                  }}
                />
              )
            }}
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
