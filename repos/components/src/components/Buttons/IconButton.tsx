import type { ReactNode, ForwardedRef, ComponentProps, ComponentType } from 'react'

import { forwardRef } from 'react'
import { TooltipHoc } from '@GBC/hocs/TooltipHoc'
import MuiIconBtn from '@mui/material/IconButton'
import { isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'

export type TIconButton = ComponentProps<typeof MuiIconBtn> & {
  iconProps?:ComponentProps<any>
  Icon?: ComponentType<any>|ReactNode
}

export const IconButtonComp = forwardRef((props:TIconButton, ref:ForwardedRef<HTMLButtonElement>) => {
  const {
    Icon,
    children,
    iconProps,
     ...rest
  } = props

  return (
    <MuiIconBtn ref={ref} {...rest} >
      {
        Icon
          ? isValidFuncComp(Icon)
            ? <Icon {...iconProps} />
            : children
          : children
      }
    </MuiIconBtn>
  )
})

export const IconButton = TooltipHoc(IconButtonComp)