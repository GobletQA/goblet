import type { CssProps, CSSObj } from '@types'
import type { ComponentProps, ComponentType, CSSProperties } from 'react'

import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { useTheme } from '@mui/material/styles'
import { CheckboxElement } from './CheckboxElement'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { useColorMap } from '@hooks/theme/useColorMap'
import { FormControlLabelProps } from '@mui/material'

export type TIconToggle = ComponentProps<typeof CheckboxElement> & {
  active?: boolean
  onColor?: string
  offColor?: string
  onProps?: SvgIconProps
  offProps?: SvgIconProps
  iconProps?: SvgIconProps
  onSx?: CSSObj
  offSx?: CSSObj
  labelSx?: CSSObj
  OnIcon?: ComponentType<any>
  Icon?: ComponentType<any>
  OffIcon?: ComponentType<any>
}

export const IconToggle = (props:TIconToggle) => {
  const {
    onSx,
    offSx,
    active,
    onProps,
    offProps,
    iconProps,
    Icon,
    labelSx,
    OnIcon=Icon,
    OffIcon=Icon || OnIcon,
    onColor='primary',
    offColor='disabled',
    labelProps=noOpObj as FormControlLabelProps,
    ...rest
  } = props

  const theme = useTheme()
  const colorMap = useColorMap()

  const primaryColor = theme.palette.primary.main
  const disableColor = theme.palette.action.disabled
  const mergedLabelProps = useMemo(() => {
    const sxColor = (labelSx && labelSx?.color)
      || ((labelProps?.sx as CSSProperties)?.color)
      || offColor

    let color = active ? onColor || sxColor : sxColor
    color = colorMap[color as keyof typeof colorMap] || color

    return {
      ...labelProps,
      sx: [labelProps?.sx, labelSx, { color }] as CssProps
    }
  }, [
    active,
    labelSx,
    onColor,
    offColor,
    colorMap,
    labelProps,
    primaryColor,
    disableColor,
  ])

  return (
    <CheckboxElement
      {...rest}
      labelProps={mergedLabelProps}
      icon={OnIcon && (<OnIcon {...iconProps} {...offProps} color={offColor} sx={onSx} />)}
      checkedIcon={OffIcon && (<OffIcon {...iconProps} {...onProps} color={onColor} sx={offSx} />)}
    />
  )
}