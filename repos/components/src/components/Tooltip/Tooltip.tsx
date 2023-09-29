import type { TooltipProps } from '@mui/material/Tooltip'

import type { ComponentProps } from 'react'
import { MuiTooltip, TooltipTitle } from './Tooltip.styled'

export type TTooltip = ComponentProps<typeof MuiTooltip> & {
  disabled?: boolean
  loc?: TooltipProps['placement']
}

export const Tooltip = (props:TTooltip) => {
  const {
    sx,
    loc,
    title,
    children,
    disabled,
    placement=loc,
    enterDelay=500,
    fontSize=`12px`,
    ...rest
  } = props


  return disabled
    ? <>{children}</>
    : (
        <MuiTooltip
          {...rest}
          sx={sx}
          title={(
            <TooltipTitle>
              {title}
            </TooltipTitle>
          )}
          fontSize={fontSize}
          enterDelay={enterDelay}
          placement={placement || `bottom`}
        >
          {children}
        </MuiTooltip>
      )
}
