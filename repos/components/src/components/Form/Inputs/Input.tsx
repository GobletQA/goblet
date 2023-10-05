import type { TInputDecor } from '@GBC/types'
import type { TInputLabel } from './InputLabel'
import type { CSSProperties, ComponentProps, RefObject, ReactNode } from 'react'
import type { FormHelperTextProps } from '@mui/material/FormHelperText'
import {
  InputText,
  InputContainer,
} from './Inputs.styled'

import { Decor } from './Decor'
import { InputLabel } from './InputLabel'
import { cls, emptyObj } from '@keg-hub/jsutils'
import { useDecor } from '@GBC/hooks/form/useDecor'
import { useLabelId } from '@GBC/hooks/form/useLabelId'
import { useInputCallbacks } from '@GBC/hooks/form/useInputCallbacks'

export type TInput = Omit<ComponentProps<typeof InputText>, `error`|`inputRef`> & TInputLabel & {
  name?: string
  error?:string
  matchId?: boolean
  required?: boolean
  multiple?: boolean
  disabled?: boolean
  decor?: TInputDecor
  className?:string
  inputSx?: CSSProperties
  helperSx?: CSSProperties
  value?:string|boolean|number
  helperTextProps?:FormHelperTextProps
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
    helperSx,
    labelSide,
    className,
    multiline,
    autoFocus,
    helperText,
    labelClass,
    InputProps,
    inputProps,
    labelWrapSx,
    labelInline,
    placeholder,
    fullWidth=true,
    helperTextProps,
    onBlur:onBlurIn,
    onFocus:onFocusIn,
    FormHelperTextProps,
    inputRef:inputRefIn,
    onChange:onChangeIn,
    onKeyDown:onKeyDownIn,
    decor=emptyObj as TInputDecor,
    ...rest
  } = props

  const {
    onBlur,
    onFocus,
    onChange,
    inputRef,
    onKeyDown,
    error: inputErr
  } = useInputCallbacks({
    required,
    autoFocus,
    multiline,
    onBlur: onBlurIn,
    onFocus: onFocusIn,
    onChange: onChangeIn,
    inputRef: inputRefIn,
    onKeyDown: onKeyDownIn,
    value: props.value || ``,
  })

  const labelId = useLabelId(props)
  const { decorProps, decorKey } = useDecor(props)

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
        labelId={labelId}
        labelSide={labelSide}
        labelClass={labelClass}
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
          ...(decorProps && { [decorKey]: (<Decor {...decorProps} />) }),
        }}
        defaultValue={props.value || ``}
        className={cls(`gb-input`, className)}
        error={Boolean(error?.length || inputErr)}
        label={labelInline && label ? label : undefined}
        placeholder={placeholder || "Enter some text..."}
        helperText={error ? error : inputErr || helperText || ` `}
        inputProps={{
          onChange,
          ...inputProps,
          onBlur: onBlur,
          onFocus: onFocus,
          disabled: disabled,
          onKeyDown: onKeyDown
        }}
        FormHelperTextProps={{
          ...FormHelperTextProps,
          ...helperTextProps,
          sx: [
            FormHelperTextProps?.sx,
            helperTextProps?.sx,
            helperSx
          ] as CSSProperties[]
        }}
        {...rest}
      />
    </InputContainer>
  )
  
}