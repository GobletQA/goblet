import type { MouseEvent } from 'react'
import type { TRaceMenuItemClickCtx } from '@gobletqa/race'

import { EAstObject } from '@ltipton/parkin'
import { FootIcon } from '@gobletqa/components'

const generateStepItems = (ctx:TRaceMenuItemClickCtx) => {
  // Then create items for each one
  // TODO: figure out a way to pass in parsed expression values from other steps?
  const { feature } = ctx

  return [
    {
      text: `Test 1`,
      closeMenu: true,
      closeParent:true,
      onClick: () => {
        console.log(`------- test 1 -------`)
      }
    },
    {
      text: `Test 2`,
      closeMenu: true,
      onClick: () => {
        console.log(`------- test 2 -------`)
      }
    },
    {
      text: `Test 3`,
      closeMenu: false,
      onClick: () => {
        console.log(`------- test 3 -------`)
      }
    }
  ]
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