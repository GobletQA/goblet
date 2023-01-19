import type { TInputDecor } from '@types'
import type { CSSProperties, SyntheticEvent, ComponentProps } from 'react'
import type {
  AutocompleteChangeReason,
  AutocompleteChangeDetails
} from '@mui/material/Autocomplete'

import { Decor } from './Decor'
import { useCallback } from 'react'
import { noOpObj, isStr, cls } from '@keg-hub/jsutils'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material'

export type AutoOpt = {
  label: string
  id: string | number
}
export type OptVal = string | AutoOpt

type TOnChange = (
  event:SyntheticEvent,
  value:OptVal|OptVal[],
  reason:AutocompleteChangeReason,
  details:AutocompleteChangeDetails
) => void

export type TAutoInput = {
  name: string
  error?:string
  className?:string
  sx?:CSSProperties
  decor?: TInputDecor
  disabled?: boolean
  options: OptVal[]
  loading?: boolean
  matchId?: boolean
  required?: boolean
  multiple?: boolean
  currentValue?:OptVal
  onChange?: TOnChange
  showCheckbox?: boolean
  rules?: Record<string, string>
  label?: TextFieldProps['label']
  onBlur?: (event:SyntheticEvent) => void
  autocompleteProps?: ComponentProps<typeof Autocomplete>
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
}

const useOnChangeVal = ({
  matchId,
  onChange,
  autocompleteProps
}:TAutoInput) => {
  return useCallback((
    event:any,
    value:OptVal,
    reason:AutocompleteChangeReason,
    details:AutocompleteChangeDetails
  ) => {
    
    let changedVal:OptVal|OptVal[] = value

    if (matchId)
      changedVal = Array.isArray(value)
        ? value.map((i: any) => i?.id || i) as OptVal[]
        : ((value as AutoOpt)?.id || value) as OptVal

    onChange?.(event, changedVal, reason, details)
    if (autocompleteProps?.onChange)
      autocompleteProps?.onChange?.(event, value, reason, details)
  }, [
    matchId,
    onChange,
    autocompleteProps?.onChange
  ])
}

export const AutoInput = (props:TAutoInput) => {
  const {
    sx,
    name,
    label,
    rules,
    error,
    onBlur,
    loading,
    options,
    multiple,
    required,
    disabled,
    className,
    showCheckbox,
    currentValue,
    textFieldProps,
    autocompleteProps,
    decor=noOpObj as TInputDecor,
    ...rest
  } = props

  const onChangeVal = useOnChangeVal(props)
  const { Component:DecorComponent, labelPos } = decor
  const decorKey = labelPos === `end` ? `endAdornment` : `startAdornment`

  return (
    <Autocomplete
      {...autocompleteProps}
      sx={sx}
      loading={loading}
      options={options}
      disabled={disabled}
      multiple={multiple}
      value={currentValue}
      onChange={onChangeVal as any}
      className={cls(`gb-auto-complete`, className)}
      disableCloseOnSelect={
        typeof autocompleteProps?.disableCloseOnSelect === 'boolean'
          ? autocompleteProps.disableCloseOnSelect
          : !!multiple
      }
      isOptionEqualToValue={
        autocompleteProps?.isOptionEqualToValue
          ? autocompleteProps.isOptionEqualToValue
          : ((option:OptVal, value:OptVal) => {
              const opVal = isStr(option) ? option : option.id
              const val = value && (isStr(value) ? value : value.id)

              return value ? opVal === val : false
            }) as any
      }
      getOptionLabel={
        autocompleteProps?.getOptionLabel
          ? autocompleteProps.getOptionLabel
          : ((option:OptVal) => isStr(option) ? option : option?.label) as any
      }
      
      renderOption={(
        autocompleteProps?.renderOption ?? (
          showCheckbox
            ? (props:ComponentProps<`li`>, option:OptVal, { selected }:Record<`selected`, boolean>) => (
                <li {...props}>
                  <>
                    <Checkbox
                      sx={{marginRight: 1}}
                      checked={selected}
                    />
                    {autocompleteProps?.getOptionLabel?.(option) || (option as AutoOpt)?.label || option}
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
          <TextField
            name={name}
            label={label}
            required={rules?.required ? true : required}
            {...textFieldProps}
            {...params}
            error={!!error}
            helperText={error ? error : textFieldProps?.helperText}
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
