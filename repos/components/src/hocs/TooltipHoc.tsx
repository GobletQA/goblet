import type { TTooltip } from '@GBC/components/Tooltip'
import type {
  ReactNode,
  ForwardedRef,
  ComponentType,
  ComponentProps
} from 'react'

import { forwardRef } from 'react'
import {isStr} from '@keg-hub/jsutils'
import {Tooltip} from '@GBC/components/Tooltip'

type THocProps<T> = T & {
  disabled?:boolean
  tooltip?:string|TTooltip
}

export const TooltipHoc = (Component:ComponentType<any>) => {

  const Hoc = forwardRef((
    props:THocProps<ComponentProps<typeof Component>>,
    ref:ForwardedRef<any>
  ) => {
    const {tooltip, ...rest} = props
    const tipProps = isStr(tooltip) ? { title: tooltip } : tooltip as TTooltip
      return tooltip && !rest.disabled
        ? (
            <Tooltip {...tipProps}>
              <Component {...rest} ref={ref} />
            </Tooltip>
          )
        : (<Component {...rest} ref={ref} />)
  })

  const compName = Component.displayName || Component.name || `Component`
  Hoc.displayName = `TooltipHoc<${compName}>`

  return Hoc
}
