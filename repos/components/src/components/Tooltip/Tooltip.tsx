import type { ComponentProps } from 'react'
import { MuiTooltip } from './Tooltip.styled'
import type { TooltipProps } from '@mui/material/Tooltip'

export type TTooltip = ComponentProps<typeof MuiTooltip> & {
  loc?: TooltipProps['placement']
}

export const Tooltip = (props:TTooltip) => {
  const {
    loc,
    placement=loc,
    enterDelay=500,
    fontSize=`12px`,
    children,
    ...rest
  } = props
  
  return (
    <MuiTooltip
      {...rest}
      fontSize={fontSize}
      enterDelay={enterDelay}
      placement={placement || `bottom`}
    >
      {children}
    </MuiTooltip>
  )
}
