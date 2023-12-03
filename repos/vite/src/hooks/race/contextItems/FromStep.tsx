import type { MouseEvent, CSSProperties } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type {
  TAudit,
  TExpPart,
  TRaceMenuItemClickCtx,
} from '@gobletqa/race'

import { EAstObject } from '@ltipton/parkin'
import { ContextItem } from './ContextItem'
import { FootIcon, colors } from '@gobletqa/components'

const generateStepItems = (ctx:TRaceMenuItemClickCtx) => {
  const { audit, onChange } = ctx

  return Object.entries(audit as TAudit).reduce((acc, [id, match]) => {
    const { expressions, defId } = match
    ;(expressions as TExpPart[]).map(exp => {
      exp.value
        && acc.push({
            closeMenu: true,
            closeParent:true,
            key: `${defId}-${exp.index}`,
            children: (
              <ContextItem
                name={exp.value}
                valuePrefix={`type: `}
                value={`${exp.kind}`}
                valuePrefixSx={{ color: colors.green12, marginRight: `2px` }}
              />
            ),
            onClick: () => {
              onChange({target: { value: exp.value, tagName: `INPUT` }})
            }
          })
    })

    return acc
  }, [] as TMenuItem[])

}

export const FromStep = {
  Icon: FootIcon,
  closeMenu: false,
  text: `From Step`,
  type: EAstObject.expression,
  id: `expression-from-step`,
  onClick: (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
    const { onSubmenu } = ctx

    onSubmenu(evt, {
      open: true,
      items: generateStepItems(ctx)
    })
    
  }
}