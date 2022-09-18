import type { ElementType } from 'react'
import SvgIcon from '@mui/material/SvgIcon'

export type TIconProps = {
  Icon?: any
  fill?: string
  color?: string
  width?: string
  height?: string
  stroke?: string
  RootEl?: ElementType
  sx?: Record<string, string>
  styles?: Record<string, string>
}

export const Icon = (props:TIconProps) => {
  const {
    sx,
    styles,
    RootEl=SvgIcon,
    Icon:IconComp,
    ...iconProps
  } = props

  return (
    <RootEl sx={[sx, styles]} inheritViewBox={true} >
      {IconComp && (<IconComp {...iconProps} />)}
    </RootEl>
  )
}