import type { MouseEvent, CSSProperties } from 'react'

import {
  colors,
  getColor,
  stopEvent,
  useInline,
  PencilAddIcon,
} from '@gobletqa/components'

export type TAddAct = {
  type:string
  onClick: (...args:any)=> void
}

export const Add = ({ type, onClick }:TAddAct) => ({
  onClick: useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  }),
  label: `Add ${type}`,
  Icon: PencilAddIcon,
  id: `pencil-add-${type}`,
  key: `pencil-add-${type}`,
  className: `pencil-add-${type}`,
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