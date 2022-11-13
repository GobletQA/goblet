import type { CSSObj } from '@types'
import type { ComponentProps } from 'react'
import { MuiTooltip } from './Tooltip.styled'


export type TTooltip = ComponentProps<typeof MuiTooltip> & {
  loc?: 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
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
      placement={placement}
    >
      {children}
    </MuiTooltip>
  )
}