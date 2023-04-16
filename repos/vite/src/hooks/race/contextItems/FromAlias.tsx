import type { MouseEvent } from 'react'
import type { TRaceMenuItemClickCtx } from '@gobletqa/race'

import { EAstObject } from '@ltipton/parkin'

import { ReflectHorIcon } from '@gobletqa/components'

export const FromAlias = {
  closeMenu: true,
  text: `From Alias`,
  Icon: ReflectHorIcon,
  id: `expression-from-alias`,
  type: EAstObject.expression,
  onClick:(ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
    const { world, onChange } = ctx
    // TODO: open a menu with a list of all alias from world.$alias
  },
}