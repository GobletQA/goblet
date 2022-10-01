import type { ComponentProps, ReactElement } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import MuiRadio from '@mui/material/Radio'
import MuiSwitch from '@mui/material/Switch'
import MuiCheckbox from '@mui/material/Checkbox'


export type TControlLabel = Omit<ComponentProps<typeof FormControlLabel>, 'control'> & {
  control?: ReactElement<any, any>
}

export type TControl = {
  Component?: any
  controlProps?: TControlLabel
}

export type TRadio = ComponentProps<typeof MuiRadio> & TControl
export type TSwitch = ComponentProps<typeof MuiSwitch> & TControl
export type TCheckbox = ComponentProps<typeof MuiSwitch> & TControl

export type TToggle = TSwitch | TCheckbox | TRadio

const ToggleControl = (props:TToggle) => {
  const {
    Component,
    controlProps,
    ...rest
  } = props
  
  return (
    <FormControlLabel
      label=""
      control={<Component {...rest} />}
      {...controlProps}
    />
  )
}

export const Switch = (props:TSwitch) => {
  return (
    <ToggleControl Component={MuiSwitch} {...props} />
  )
}

export const Checkbox = (props:TCheckbox) => {
  return (
    <ToggleControl Component={MuiCheckbox} {...props} />
  )
}

export const Radio = (props:TRadio) => {
  return (
    <ToggleControl Component={MuiRadio} {...props} />
  )
}



