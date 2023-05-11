import type { TooltipProps } from '@mui/material/Tooltip'

import type { ComponentProps } from 'react'
import { MuiTooltip } from './Tooltip.styled'

export type TTooltip = ComponentProps<typeof MuiTooltip> & {
  disabled?: boolean
  loc?: TooltipProps['placement']
}

export const Tooltip = (props:TTooltip) => {
  const {
    loc,
    disabled,
    placement=loc,
    enterDelay=500,
    fontSize=`12px`,
    children,
    ...rest
  } = props
  
  return disabled
    ? <>{children}</>
    : (
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
