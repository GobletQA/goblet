import type { ComponentProps, ComponentType, CSSProperties } from 'react'
import { SxProps, Theme } from '@mui/system';
import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { useTheme } from '@mui/material/styles'
import { FormControlLabel } from '@mui/material'
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
  onSx?: CSSProperties
  offSx?: CSSProperties
  OnIcon?: ComponentType<any>,
  Icon?: ComponentType<any>,
  OffIcon?: ComponentType<any>,
}

export const IconToggle = (props:TIconToggle) => {
  const {
    onSx,
    offSx,
    active,
    onProps,
    offProps,
    iconProps,
    onColor='primary',
    offColor='disabled',
    Icon,
    OnIcon=Icon,
    OffIcon=Icon || OnIcon,
    labelSx,
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
      sx: [labelProps?.sx, labelSx, { color }] as SxProps<Theme>
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