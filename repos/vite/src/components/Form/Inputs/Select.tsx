import type { ComponentProps } from 'react'
import type { TOptions } from '../form.types'

import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Input } from './Input'

export type TSelect = ComponentProps<typeof Input> & {
  selectProps?: ComponentProps<typeof MuiSelect>
  optionProps?: ComponentProps<typeof MenuItem>
  options?: TOptions
}

export const Select = (props:TSelect) => {
  const {
    options,
    children,
    selectProps,
    optionProps,
    ...rest
  } = props
  
  return (
    <Input value="" {...rest} SelectProps={selectProps} select >
      {options ? (
        options.map((opt) => {
          const { key, label, value, ...optRest } = typeof opt === `object`
            ? opt
            : { key: opt, value: opt, label: opt }

          return (
            <MenuItem
              {...optionProps}
              key={key || label || value}
              value={value}
            >
              {label || value}
            </MenuItem>
          )
        })
      ) : (
        children || (
          <MenuItem
            {...optionProps}
            key={'form-get-empty'}
            value=""
          >
            Empty
          </MenuItem>
        )
      )}
    </Input>
  )
}