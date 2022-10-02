import type { ElementType, ReactNode } from 'react'
import { useMemo } from 'react'
import SvgIcon from '@mui/material/SvgIcon'
import { exists }  from '@keg-hub/jsutils'

export type TIconProps = {
  Icon?: any
  fill?: string
  color?: string
  width?: string
  height?: string
  stroke?: string
  viewBox?: string
  delta?: string
  RootEl?: ElementType
  children?: ReactNode
  inheritViewBox?: boolean
  sx?: Record<string, string>
  styles?: Record<string, string>
}

export const Icon = (props:TIconProps) => {
  const {
    sx,
    delta,
    styles,
    viewBox,
    children,
    RootEl=SvgIcon,
    Icon:IconComp,
    inheritViewBox,
    ...iconProps
  } = props

  const withViewBox = useMemo(() => {
    return exists(inheritViewBox) ? inheritViewBox : !Boolean(viewBox)
  }, [inheritViewBox, viewBox])

  return (
    <RootEl inheritViewBox={withViewBox} viewBox={viewBox} sx={[sx, styles]}>
      {delta && (<path d={delta}></path>)}
      {children || IconComp && (<IconComp {...iconProps} />)}
    </RootEl>
  )
}