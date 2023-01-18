import type { SyntheticEvent, ComponentProps } from 'react'

import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete'
import { useCallback } from 'react'
import { isStr } from '@keg-hub/jsutils'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material'



type AutoOpt = {
  label: string
  id: string | number
}
type OptVal = string | AutoOpt

type TOnChange = (
  event:SyntheticEvent,
  value:OptVal,
  reason:AutocompleteChangeReason,
  details:AutocompleteChangeDetails
) => void

export type AutocompleteElementProps = {
  name: string
  options: OptVal[]
  multiple?: boolean
  loading?: boolean
  matchId?: boolean
  required?: boolean
  currentValue:OptVal
  showCheckbox?: boolean
  label?: TextFieldProps['label']
  onChange?: TOnChange
  onBlur: (event:SyntheticEvent) => void
  autocompleteProps?: ComponentProps<typeof Autocomplete>
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
}


const useOnChangeVal = ({
  matchId,
  onChange,
  autocompleteProps
}:AutocompleteElementProps) => {
  return useCallback((
    event:any,
    value:OptVal,
    reason:AutocompleteChangeReason,
    details:AutocompleteChangeDetails
  ) => {
    let changedVal = value
    if (matchId)
      changedVal = (Array.isArray(value))
        ? value.map((i: any) => i?.id || i)
        : value?.id || value
    onChange?.(event, value, reason, details)
    if (autocompleteProps?.onChange)
      autocompleteProps?.onChange?.(event, value, reason, details)
  }, [
    matchId,
    onChange,
    autocompleteProps?.onChange
  ])
}

export const AutocompleteElement = (props:AutocompleteElementProps) => {
  const {
    name,
    label,
    onBlur,
    loading,
    options,
    multiple,
    required,
    showCheckbox,
    currentValue,
    textFieldProps,
    autocompleteProps,
  } = props

  const onChangeVal = useOnChangeVal(props)

  return (

    <Autocomplete
      {...autocompleteProps}
      value={currentValue}
      loading={loading}
      multiple={multiple}
      options={options}
      onChange={onChangeVal}
      disableCloseOnSelect={
        typeof autocompleteProps?.disableCloseOnSelect === 'boolean'
          ? autocompleteProps.disableCloseOnSelect
          : !!multiple
      }
      isOptionEqualToValue={
        autocompleteProps?.isOptionEqualToValue
          ? autocompleteProps.isOptionEqualToValue
          : (option:OptVal, value:OptVal) => {
            const opVal = isStr(option) ? option : option.id
            const val = value && (isStr(value) ? value : value.id)

            return value ? opVal === val : false
          }
      }
      getOptionLabel={
        autocompleteProps?.getOptionLabel
          ? autocompleteProps.getOptionLabel
          : (option:OptVal) => isStr(option) ? option : option?.label
      }
      
      renderOption={
        autocompleteProps?.renderOption ?? (
          showCheckbox
            ? (props, option, {selected}) => (
                <li {...props}>
                  <Checkbox
                    sx={{marginRight: 1}}
                    checked={selected}
                  />
                  {autocompleteProps?.getOptionLabel?.(option) || option.label || option}
                </li>
              )
            : undefined
        )
      }
      onBlur={(event) => {
        onBlur()
        if (typeof autocompleteProps?.onBlur === 'function')
          autocompleteProps.onBlur(event)
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
            helperText={error ? error.message : textFieldProps?.helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20}/> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              ...textFieldProps?.InputProps,
            }}
            inputProps={{
              ...params.inputProps,
              ...textFieldProps?.inputProps,
            }}
            InputLabelProps={{
              ...textFieldProps?.InputLabelProps,
              ...params.InputLabelProps,
            }}
          />
        )
      }}
      {...fieldRest}
    />

  )
}
