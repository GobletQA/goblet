import type { CssProps, CSSObj } from '@types'
import type { TExtLabelProps } from './inputHooks'
import type { ReactNode, CSSProperties } from 'react'

import { useCallback } from 'react'
import { useJoinSx } from '@hooks/theme/useJoinSx'
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

export type CheckboxElementProps<T extends FieldValues> = Omit<CheckboxProps, `name`|`onChange`>
  & TExtLabelProps
  & {
      name: Path<T>
      helperText?: string
      control?: Control<T>
      labelSx?: CSSProperties
      onChange: (value:boolean) => any
      labelProps?: FormControlLabelProps
      validation?: ControllerProps['rules']
      label?: FormControlLabelProps['label']
      labelPos?:`top`|`bottom`|`start`|`end`
      parseError?: (error: FieldError) => string
      labelPlacement?:`top`|`bottom`|`start`|`end`
    }

export type TCheckboxLabel = Omit<
  CheckboxElementProps<FieldValues>,
  `label` | `name` | `labelPos` | `parseError` | `labelSx` | `control` | `helperText`
> & {
  label?:ReactNode
  invalid:boolean
}

const defSx:CSSObj = { marginLeft: `0px` }

const CheckboxLabel = (props:TCheckboxLabel) => {
  const {
    value,
    label,
    invalid,
    onChange,
    disabled,
    labelProps,
    labelPlacement,
    ...rest
  } = props
  
  const onChangeCB = useCallback(() => onChange?.(!value), [value, onChange])
  const sx = useJoinSx(defSx, labelProps?.sx as CSSObj)

  return (
    <FormGroup row>
      <FormControlLabel
        {...labelProps}
        sx={sx}
        label={label}
        disabled={disabled}
        labelPlacement={labelPlacement}
        control={
          <Checkbox
            {...rest}
            value={value}
            checked={!!value}
            disabled={disabled}
            onChange={onChangeCB}
            color={rest.color || 'primary'}
            sx={[(rest?.sx as CSSObj), { color: invalid ? 'error.main' : undefined }]}
          />
        }
      />
    </FormGroup>
  )
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

  if (required && !validation.required) validation.required = `This field is required`

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
          <FormControl
            error={invalid}
            required={required}
          >
            <CheckboxLabel
              {...rest}
              value={value}
              invalid={invalid}
              onChange={onChange}
              labelProps={labelProps}
              label={label || labelProps?.label || ''}
              disabled={disabled || labelProps?.disabled}
              labelPlacement={
                labelPlacement || labelPos || labelProps?.labelPlacement || labelProps?.labelPos
              }
            />
            {parsedHelperText && (
              <FormHelperText error={invalid}>
                {parsedHelperText}
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}