import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import {
  colors,
  getColor,
  stopEvent,
  useInline,
  PencilAddIcon,
} from '@gobletqa/components'

export type TAddAct = {
  type:string
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

export const Add = ({ Icon, type, onClick }:TAddAct) => ({
  onClick: useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  }),
  label: `Add ${type}`,
  id: `pencil-add-${type}`,
  key: `pencil-add-${type}`,
  Icon: Icon || PencilAddIcon,
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