import type { TooltipProps } from '@mui/material/Tooltip'

import type { ComponentProps, ComponentType } from 'react'
import { MuiTooltip, TooltipTitle, TooltipWrap } from './Tooltip.styled'

export type TTooltip = ComponentProps<typeof MuiTooltip> & {
  wrap?:boolean
  Wrap?:ComponentType<any>
  disabled?: boolean
  loc?: TooltipProps['placement']
}

export const Tooltip = (props:TTooltip) => {
  const {
    sx,
    loc,
    wrap,
    title,
    children,
    disabled,
    Wrap=TooltipWrap,
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
          {wrap ? (<Wrap>{children}</Wrap>) : children}
        </MuiTooltip>
      )
}
