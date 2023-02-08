import type { MouseEvent } from 'react'
import type { TRaceMenuItemClickCtx, TRaceMenuItem, TRaceContextMenu } from '@gobletqa/race'

import { useMemo } from 'react'
import { selectElement } from '@actions/socket/api/selectElement'
import { ReflectHorIcon, SelectDragIcon } from '@gobletqa/components'

export const useContextMenu = () => {
  return useMemo(() => {
    return {
      expression: [
        {
          closeMenu: false,
          Icon: SelectDragIcon,
          text: `From Browser`,
          onClick: async (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
            const { setInputProps, onChange } = ctx

            setInputProps({
              disabled: true,
              className: `gb-select-element-active`,
              helperText: `Select an element from the browser`
            })

            const data = await selectElement()
            setInputProps({})

            onChange?.({target: { value: data.target }})
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