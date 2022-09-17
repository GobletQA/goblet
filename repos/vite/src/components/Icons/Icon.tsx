import type { ElementType } from 'react'
import Box from '@mui/material/Box'

export type TIconProps = {
  Icon?: any
  fill?: string
  color?: string
  width?: string
  height?: string
  RootEl?: ElementType
  sx?: Record<string, string>
  styles?: Record<string, string>
}

export const Icon = (props:TIconProps) => {
  const {
    sx,
    styles,
    RootEl=Box,
    Icon:IconComp,
    ...iconProps
  } = props
  
  return (
    <RootEl sx={[sx, styles]} >
      {IconComp && (<IconComp {...iconProps} />)}
    </RootEl>
  )
  
}