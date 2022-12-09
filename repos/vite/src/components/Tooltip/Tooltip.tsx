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
    children,
    ...rest
  } = props
  
  return (
    <MuiTooltip
      {...rest}
      placement={placement || `bottom`}
    >
      {children}
    </MuiTooltip>
  )
}
