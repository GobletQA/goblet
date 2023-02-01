import type { CSSProperties } from 'react'

import {
  colors,
  getColor,
  TrashIcon,
  stopEvent,
  useInline,
} from '@gobletqa/components'


export type TDeleteAct = {
  type:string
  onClick: (...args:any)=> void
}

export const Delete = ({ type, onClick }:TDeleteAct) => ({
  onClick: useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  }),
  label: `Delete`,
  Icon: TrashIcon,
  id: `trash-${type}`,
  key: `trash-${type}`,
  className: `trash-${type}`,
  sx: {
    width: `24px`,
    height: `24px`,
    color: getColor(colors.gray05, colors.gray15),
    [`& svg`]: {
      width: `22px`,
      height: `22px`,
    },
    [`&:hover`]: {
      color: colors.red10,
    }
  } as CSSProperties
})