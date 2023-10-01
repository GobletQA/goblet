import type { ComponentType, ComponentProps } from 'react'
import type { TTooltip } from '@GBC/components/Tooltip'

import {Tooltip} from '@GBC/components/Tooltip'
import {isStr} from '@keg-hub/jsutils'

type THocProps = {
  disabled?:boolean
  tooltip?:string|TTooltip
}

export const TooltipHoc = (Component:ComponentType<any>) => {
  type TCompProps = ComponentProps<typeof Component>
  
  const Hoc = <T extends TCompProps=TCompProps>(props:T & THocProps) => {
    const {tooltip, ...rest} = props
    const tipProps = isStr(tooltip) ? { title: tooltip } : tooltip as TTooltip
    
    return tooltip && !rest.disabled
      ? (
          <Tooltip {...tipProps}>
            <Component {...rest} />
          </Tooltip>
        )
      : (<Component {...rest} />)
  }

  const compName = Component.displayName || Component.name || `Component`
  Hoc.displayName = `TooltipHoc<${compName}>`

  return Hoc
}
