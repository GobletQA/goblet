import type { CSSObj } from '@types'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { ComponentProps, ComponentType } from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { useLabelProps } from './inputHooks'
import { CheckboxElement } from './CheckboxElement'
import { FormControlLabelProps } from '@mui/material'

export type TIconToggle = ComponentProps<typeof CheckboxElement> & {
  onSx?: CSSObj
  offSx?: CSSObj
  labelSx?: CSSObj
  active?: boolean
  onColor?: string
  offColor?: string
  onProps?: SvgIconProps
  offProps?: SvgIconProps
  iconProps?: SvgIconProps
  Icon?: ComponentType<any>
  OnIcon?: ComponentType<any>
  OffIcon?: ComponentType<any>
  labelProps?: FormControlLabelProps
}

export const IconToggle = (props:TIconToggle) => {
  const {
    onSx,
    Icon,
    offSx,
    active,
    labelSx,
    onProps,
    offProps,
    iconProps,
    OnIcon=Icon,
    onColor='primary',
    offColor='disabled',
    OffIcon=Icon || OnIcon,
    labelProps=noOpObj as FormControlLabelProps,
    ...rest
  } = props

  const mergedLabelProps = useLabelProps<FormControlLabelProps>(props)

  return (
    <CheckboxElement
      {...rest}
      labelProps={mergedLabelProps}
      icon={OnIcon && (<OnIcon {...iconProps} {...offProps} color={offColor} sx={onSx} />)}
      checkedIcon={OffIcon && (<OffIcon {...iconProps} {...onProps} color={onColor} sx={offSx} />)}
    />
  )
}