import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { useTheme } from '@gobletqa/components'
import { useColorMap } from '@GBC/hooks/theme/useColorMap'

export type TExtLabelProps = {
  label?:string
  labelSx?: CSSProperties
  labelProps?: Record<any, any>
  labelPos?:`top`|`bottom`|`start`|`end`
  labelPlacement?:`top`|`bottom`|`start`|`end`
}

export type THLabelProps = TExtLabelProps & {
  active?:boolean
  onColor?:string
  offColor?:string
  disabled?:boolean
  buttonSx?: CSSProperties
  buttonProps?: Record<any, any>
}

export const useLabelProps = <T=Record<any, any>>(props:THLabelProps) => {
  const {
    label,
    active,
    labelSx,
    buttonSx,
    onColor,
    offColor,
    labelPos,
    labelPlacement,
    labelProps=(noOpObj as Record<any, any>),
    buttonProps=(noOpObj as Record<any, any>),
  } = props
  
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main
  const disableColor = theme.palette.action.disabled
  const colorMap = useColorMap()

  return useMemo(() => {
    const sxColor = (labelSx && (labelSx as CSSProperties)?.color)
      || ((buttonSx as CSSProperties)?.color)
      || ((labelProps?.sx as CSSProperties)?.color)
      || ((buttonProps?.sx as CSSProperties)?.color)
      || offColor

    let color = active ? onColor || sxColor : sxColor
    color = colorMap[color as keyof typeof colorMap] || color
    const { labelPos:_, ...rest } = labelProps

    return {
      ...rest,
      ...buttonProps,
      label: label || labelProps?.label,
      sx: [labelProps?.sx, buttonProps?.sx, labelSx, buttonSx, { color }] as CSSProperties[],
      labelPlacement: labelPlacement || labelPos || labelProps?.labelPlacement || labelProps.labelPos
    } as T
  }, [
    label,
    active,
    labelSx,
    buttonSx,
    onColor,
    offColor,
    colorMap,
    labelPos,
    labelProps,
    buttonProps,
    primaryColor,
    disableColor,
    labelPlacement,
  ])
}