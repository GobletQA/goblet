import type { MouseEvent } from 'react'
import type { TRaceMenuItemClickCtx, TRaceMenuItem, TRaceContextMenu } from '@gobletqa/race'

import { useMemo } from 'react'
import { selectElement } from '@actions/socket/api/selectElement'
import {
  ReflectHorIcon,
  CursorClickIcon,
} from '@gobletqa/components'

export const useContextMenu = () => {
  return useMemo(() => {
    return {
      expression: [
        {
          closeMenu: false,
          Icon: CursorClickIcon,
          text: `From Browser`,
          onClick: async (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
            const {
              active,
              onChange,
              setInputProps,
            } = ctx

            setInputProps({
              disabled: true,
              className: `gb-select-element-active`,
              helperText: `Select an element from the browser`
            })

            const data = await selectElement({
              selectorType: active.kind
            })

            const value = active.kind === `text` ? data.elementText : data.target
            setInputProps({})

            onChange?.({target: { value }})
          },
        },
        {
          Icon: ReflectHorIcon,
          onClick:(ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
            const { world, onChange } = ctx
            // TODO: open a menu with a list of all alias from world.$alias
          },
          text: `From Alias`,
        },
      ]
    }
  }, [])
}