import type { MouseEvent, CSSProperties } from 'react'

import {
  colors,
  getColor,
  stopEvent,
  useInline,
  TextboxPlusIcon,
} from '@gobletqa/components'

export type TAddAct = {
  type:string
  onClick: (...args:any)=> void
}

export const AddStory = ({ type, onClick }:TAddAct) => ({
  onClick: useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  }),
  label: `Add User Story`,
  Icon: TextboxPlusIcon,
  id: `story-add-${type}`,
  key: `story-add-${type}`,
  className: `story-add-${type}`,
  sx: {
    width: `24px`,
    height: `24px`,
    color: getColor(colors.gray05, colors.gray15),
    [`& svg`]: {
      width: `22px`,
      height: `22px`,
    },
    [`&:hover`]: {
      color: colors.green10,
    }
  } as CSSProperties
})
