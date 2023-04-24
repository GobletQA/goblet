import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TRaceMenuItemClickCtx } from '@gobletqa/race'

import { EAstObject } from '@ltipton/parkin'
import { ContextItem } from './ContextItem'
import { ReflectHorIcon, colors } from '@gobletqa/components'

const generateAliasItems = (ctx:TRaceMenuItemClickCtx) => {
  const { world, onChange } = ctx

  return Object.entries(world.$alias as Record<string, string>).reduce((acc, [key, value]) => {
    acc.push({
      key,
      closeMenu: true,
      closeParent:true,
      children: (
        <ContextItem
          name={key}
          valuePrefix={`selector:`}
          value={`${value}`}
          valuePrefixSx={{ color: colors.green12, marginRight: `2px` }}
        />
      ),
      onClick: () => {
        onChange({target: { value: `$$${key}`, tagName: `INPUT` }})
      }
    })

    return acc
  }, [] as TMenuItem[])

}

export const FromAlias = {
  closeMenu: false,
  text: `From Alias`,
  Icon: ReflectHorIcon,
  id: `expression-from-alias`,
  type: EAstObject.expression,
  onClick:(ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
    const { onSubmenu } = ctx

    onSubmenu(evt, {
      open: true,
      items: generateAliasItems(ctx)
    })
  },
}