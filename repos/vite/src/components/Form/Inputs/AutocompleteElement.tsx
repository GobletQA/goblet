import {Control, Controller, ControllerProps, Path} from 'react-hook-form'
import {Autocomplete, AutocompleteProps, Checkbox, TextField, TextFieldProps} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { FieldValues } from 'react-hook-form/dist/types/fields'

type TOmitAutoCompProps = Omit<
  AutocompleteProps<T, M, D, any>,
  'name' | 'options' | 'loading' | 'renderInput'
>

export type AutocompleteElementProps<
  F extends FieldValues,
  T,
  M extends boolean | undefined,
  D extends boolean | undefined
> = {
  options: T[]
  multiple?: M
  name: Path<F>
  loading?: boolean
  matchId?: boolean
  required?: boolean
  control?: Control<F>
  showCheckbox?: boolean
  label?: TextFieldProps['label']
  rules?: ControllerProps['rules']
  autocompleteProps?: TOmitAutoCompProps
  textFieldProps?: Omit<TextFieldProps, 'name' | 'required' | 'label'>
}

type AutoDefault = {
  id: string | number
  label: string
}

type TAutoCompEl = AutocompleteElementProps<
  TFieldValues,
  AutoDefault | string | any, boolean | undefined, boolean | undefined
>

export const AutocompleteElement = <TFieldValues extends FieldValues>({
  name,
  rules,
  label,
  matchId,
  control,
  loading,
  options,
  multiple,
  required,
  showCheckbox,
  textFieldProps,
  autocompleteProps,
}: TAutoCompEl) => {

  const validationRules: ControllerProps['rules'] = {
    ...rules,
    ...(required && { required: rules?.required || 'This field is required' })
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({field: {onChange, onBlur, value, ...fieldRest}, fieldState: {error}}) => {
        let currentValue = multiple ? value || [] : value || null
        if (matchId) {
          currentValue = multiple
            ? (value || []).map((i: any) => options.find((j) => (j.id || j) === i))
            : options.find((i) => (i.id || i) === value) || null
        }
        return (
          <Autocomplete
            {...autocompleteProps}
            value={currentValue}
            loading={loading}
            multiple={multiple}
            options={options}
            disableCloseOnSelect={
              typeof autocompleteProps?.disableCloseOnSelect === 'boolean'
                ? autocompleteProps.disableCloseOnSelect
                : !!multiple
            }
            isOptionEqualToValue={
              autocompleteProps?.isOptionEqualToValue
                ? autocompleteProps.isOptionEqualToValue
                : (option, value) => value ? option.id === (value?.id || value) : false
            }
            getOptionLabel={
              autocompleteProps?.getOptionLabel
                ? autocompleteProps.getOptionLabel
                : (option) => `${option?.label || option}`
            }
            onChange={(event, value, reason, details) => {
              let changedVal = value
              if (matchId)
                changedVal = (Array.isArray(value))
                  ? value.map((i: any) => i?.id || i)
                  : value?.id || value
              onChange(changedVal)
              if (autocompleteProps?.onChange)
                autocompleteProps.onChange(event, value, reason, details)
            }}
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
      }}
    />
  )
}
