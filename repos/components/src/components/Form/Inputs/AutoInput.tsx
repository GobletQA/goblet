import type { KeyboardEvent, ReactNode, CSSProperties, SyntheticEvent, ComponentProps } from 'react'
import type { TAutoOptVal, TAutoOpt, TOnAutoChange, TInputDecor } from '@GBC/types'
import type {
  AutocompleteChangeReason,
  AutocompleteChangeDetails
} from '@mui/material/Autocomplete'

import { Decor } from './Decor'
import { useCallback } from 'react'

import { InputLabel } from './InputLabel'
import { useInline } from '@GBC/hooks/useInline'
import { emptyObj, isStr, cls } from '@keg-hub/jsutils'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Checkbox,
  TextFieldProps,
} from '@mui/material'
import {
  Auto,
  AutoContainer,
  AutoTextInput,
  AutoInputControl,
  AutoInputContainer,
} from './Inputs.styled'

export type TAutoInput = {
  id?:string
  name: string
  error?:string
  freeSolo?:boolean
  matchId?: boolean
  className?:string
  loading?: boolean
  sx?:CSSProperties
  value?:TAutoOptVal
  required?: boolean
  multiple?: boolean
  labelSide?:boolean
  disabled?: boolean
  decor?: TInputDecor
  placeholder?:string
  labelInline?:boolean
  helperText?:ReactNode
  showCheckbox?: boolean
  options?: TAutoOptVal[]
  labelSx?: CSSProperties
  onChange?: TOnAutoChange
  currentValue?:TAutoOptVal
  defaultValue?:TAutoOptVal
  labelWrapSx?: CSSProperties
  rules?: Record<string, string>
  label?: TextFieldProps['label']
  onBlur?: (event:SyntheticEvent) => void
  variant?:`outlined`|`filled`|`standard`
  autocompleteProps?: Partial<ComponentProps<typeof Auto>>
  color?: `primary`|`secondary`|`error`|`info`|`success`|`warning`
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
}

const useOnChangeVal = ({
  matchId,
  onChange,
  autocompleteProps
}:TAutoInput) => {
  return useCallback((
    event:any,
    value:TAutoOptVal,
    reason:AutocompleteChangeReason,
    details:AutocompleteChangeDetails
  ) => {
    
    let changedVal:TAutoOptVal|TAutoOptVal[] = value

    if (matchId)
      changedVal = Array.isArray(value)
        ? value.map((i: any) => i?.id || i) as TAutoOptVal[]
        : ((value as TAutoOpt)?.id || value) as TAutoOptVal

    onChange?.(event, changedVal, reason, details)
    if (autocompleteProps?.onChange)
      autocompleteProps?.onChange?.(event, value, reason, details)
  }, [
    matchId,
    onChange,
    autocompleteProps?.onChange
  ])
}

const AutoInputComp = (props:TAutoInput) => {
  const {
    id,
    sx,
    name,
    label,
    rules,
    error,
    color,
    value,
    onBlur,
    variant,
    loading,
    labelSx,
    multiple,
    required,
    freeSolo,
    disabled,
    className,
    labelSide,
    options=[],
    helperText,
    labelInline,
    placeholder,
    labelWrapSx,
    showCheckbox,
    defaultValue,
    textFieldProps,
    autocompleteProps,
    currentValue=value,
    decor=emptyObj as TInputDecor,
    ...rest
  } = props

  const onChangeVal = useOnChangeVal(props)
  const { Component:DecorComponent, decorPos=`start` } = decor
  const decorKey = decorPos === `end` ? `endAdornment` : `startAdornment`

  const onKeyDown = useInline((evt:KeyboardEvent) => {
    const evtKey = evt as Record<`key`, string> 
    if(evtKey.key !== `Enter`) return

    const target = evt?.target as HTMLInputElement
    const value = target?.value
    onChangeVal(
      evt,
      value,
      `selectOption`,
      { option: value }
    )
    target?.blur?.()
  })

  return (
      <Auto
        {...autocompleteProps}
        sx={sx}
        loading={loading}
        options={options}
        freeSolo={freeSolo}
        disabled={disabled}
        multiple={multiple}
        value={currentValue}
        defaultValue={defaultValue}
        onChange={onChangeVal as any}
        className={cls(
          className,
          `gb-auto-complete`,
          labelSide ? `gc-auto-input-side` : `gc-auto-input`
        )}
        disableCloseOnSelect={
          typeof autocompleteProps?.disableCloseOnSelect === 'boolean'
            ? autocompleteProps.disableCloseOnSelect
            : !!multiple
        }
        isOptionEqualToValue={
          autocompleteProps?.isOptionEqualToValue
            ? autocompleteProps.isOptionEqualToValue
            : ((option:TAutoOptVal, value:TAutoOptVal) => {
                const opVal = isStr(option) ? option : option.id
                const val = value && (isStr(value) ? value : value.id)

                return value ? opVal === val : false
              }) as any
        }
        getOptionLabel={
          autocompleteProps?.getOptionLabel
            ? autocompleteProps.getOptionLabel
            : ((option:TAutoOptVal) => isStr(option) ? option : option?.label) as any
        }
        
        renderOption={(
          autocompleteProps?.renderOption ?? (
            showCheckbox
              ? (props:ComponentProps<`li`>, option:TAutoOptVal, { selected }:Record<`selected`, boolean>) => (
                  <li {...props}>
                    <>
                      <Checkbox
                        sx={{marginRight: 1}}
                        checked={selected}
                      />
                      {autocompleteProps?.getOptionLabel?.(option) || (option as TAutoOpt)?.label || option}
                    </>
                  </li>
                )
              : undefined
        )) as any}
        onBlur={(event) => {
          onBlur?.(event)
          autocompleteProps?.onBlur?.(event)
        }}
        renderInput={(params) => {
          return (
            <AutoTextInput
              name={name}
              required={rules?.required ? true : required}
              label={labelInline && label ? label : undefined}
              {...textFieldProps}
              {...params}
              className={cls(
                `gc-auto-input-text`,
                labelSide && `gc-auto-input-text-side`
              )}
              error={!!error}
              variant={variant}
              id={params.id || id}
              placeholder={placeholder || "Select an option..."}
              helperText={
                error
                  ? error
                  : helperText || textFieldProps?.helperText || ` `
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                ...(DecorComponent && {
                  [decorKey]: (
                    <Decor
                      {...decor}
                      Component={DecorComponent}
                    />
                  )
                }),
                ...textFieldProps?.InputProps,
              }}
              inputProps={{
                ...params.inputProps,
                ...textFieldProps?.inputProps,
                onKeyDown: onKeyDown,
              }}
              InputLabelProps={{
                shrink: true,
                ...textFieldProps?.InputLabelProps,
                ...params.InputLabelProps,
              }}
            />
          )
        }}
        {...rest}
      />
  )
}


export const AutoInput = (props:TAutoInput) => {
  const {
    id,
    label,
    labelSx,
    labelSide,
    labelWrapSx,
    labelInline,
  } = props

  return (
    <AutoContainer
      className={cls(
        `gc-auto-input-root`,
        `gc-auto-input-container`,
        labelSide && `gc-auto-input-container-side`
      )}
    >
      {
        !labelSide
          ? (
              <>
                <InputLabel
                  id={id}
                  label={label}
                  labelSx={labelSx}
                  labelSide={labelSide}
                  labelWrapSx={labelWrapSx}
                  labelInline={labelInline}
                />
                <AutoInputComp {...props} />
              </>
            )
          : (
              <AutoInputControl className={cls(labelSide && `gc-auto-input-control-side`)}>
                <AutoInputContainer>
                  <InputLabel
                    id={id}
                    label={label}
                    labelSx={labelSx}
                    labelSide={labelSide}
                    labelWrapSx={labelWrapSx}
                    labelInline={labelInline}
                  />
                  <AutoInputComp {...props} />
                </AutoInputContainer>
              </AutoInputControl>
            )
      }
    </AutoContainer>
  )
  
}