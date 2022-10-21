import type { CSSProperties, ComponentProps } from 'react'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import {Control, Controller, ControllerProps, FieldError, Path} from 'react-hook-form'

import {
  Checkbox,
  FormGroup,
  FormControl,
  CheckboxProps,
  FormHelperText,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material'


export type CheckboxElementProps<T extends FieldValues> = Omit<CheckboxProps, 'name'> & {
  name: Path<T>
  helperText?: string
  control?: Control<T>
  labelSx?: CSSProperties
  labelProps?: FormControlLabelProps
  validation?: ControllerProps['rules']
  label?: FormControlLabelProps['label']
  parseError?: (error: FieldError) => string
  labelPos?:`top`|`bottom`|`start`|`end`
  labelPlacement?:`top`|`bottom`|`start`|`end`
}

export const CheckboxElement = <TFieldValues extends FieldValues>({
  name,
  label,
  control,
  required,
  labelSx,
  labelPos,
  disabled,
  helperText,
  parseError,
  labelProps,
  labelPlacement,
  validation = {},
  ...rest
}:CheckboxElementProps<TFieldValues>): JSX.Element => {

  if (required && !validation.required) validation.required = 'This field is required'

  return (
    <Controller
      name={name}
      rules={validation}
      control={control}
      render={({field: {value, onChange}, fieldState: {invalid, error}}) => {

        const parsedHelperText = error
          ? (typeof parseError === 'function' ? parseError(error) : error.message)
          : helperText

        return (
          <FormControl required={required} error={invalid}>
            <FormGroup row>
              <FormControlLabel
                {...labelProps}
                disabled={disabled}
                label={label || ''}
                labelPlacement={labelPlacement || labelPos}
                control={
                  <Checkbox
                    {...rest}
                    disabled={disabled}
                    color={rest.color || 'primary'}
                    sx={{
                      ...rest.sx,
                      color: invalid ? 'error.main' : undefined
                    }}
                    value={value}
                    checked={!!value}
                    onChange={() => {
                      onChange(!value)
                    }}
                  />
                }
              />
            </FormGroup>
            {parsedHelperText && (
              <FormHelperText error={invalid}>{parsedHelperText}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}