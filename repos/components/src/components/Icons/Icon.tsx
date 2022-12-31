import type { CSSProperties, ElementType, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import SvgIcon from '@mui/material/SvgIcon'
import { exists, cls }  from '@keg-hub/jsutils'

export type TIconProps = {
  Icon?: any
  fill?: string
  color?: string
  width?: string
  height?: string
  stroke?: string
  viewBox?: string
  delta?: string
  className?:string
  RootEl?: ElementType
  children?: ReactNode
  inheritViewBox?: boolean
  sx?: CSSProperties
  style?: CSSProperties
  styles?: CSSProperties
  onClick?: (event:Event) => void
}

export const Icon = forwardRef((props:TIconProps, ref) => {
  const {
    sx,
    delta,
    style,
    styles,
    viewBox,
    children,
    className,
    RootEl=SvgIcon,
    Icon:IconComp,
    inheritViewBox,
    ...rootProps
  } = props



  const withViewBox = useMemo(() => {
    return exists(inheritViewBox) ? inheritViewBox : !Boolean(viewBox)
  }, [inheritViewBox, viewBox])

  return (
    <RootEl
      ref={ref}
      viewBox={viewBox}
      className={className}
      sx={[sx, styles, style]}
      inheritViewBox={withViewBox}
      {...rootProps}
    >
      {delta && (<path d={delta}></path>)}
      {children || IconComp && (<IconComp className={className} />)}
    </RootEl>
  )
})