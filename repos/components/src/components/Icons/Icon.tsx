import type { CSSProperties, ElementType, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import SvgIcon from '@mui/material/SvgIcon'
import { exists, cls }  from '@keg-hub/jsutils'
import { useJoinSx } from '@GBC/hooks/theme/useJoinSx'

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
  svgStyle?: CSSProperties
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

  const joinedSx = useJoinSx(sx, styles, style)

  const withViewBox = useMemo(() => {
    return exists(inheritViewBox) ? inheritViewBox : !Boolean(viewBox)
  }, [inheritViewBox, viewBox])

  return (
    <RootEl
      ref={ref}
      sx={joinedSx}
      viewBox={viewBox}
      className={className}
      inheritViewBox={withViewBox}
      {...rootProps}
    >
      {delta && (<path d={delta}></path>)}
      {children || IconComp && (<IconComp className={className} />)}
    </RootEl>
  )
})