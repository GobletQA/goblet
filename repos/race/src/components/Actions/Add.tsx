import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { capitalize, emptyObj } from '@keg-hub/jsutils'
import {
  colors,
  getColor,
  stopEvent,
  useInline,
  PencilAddIcon,
} from '@gobletqa/components'

export type TAddAct = {
  type:string
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

export const Add = ({ Icon, type, onClick, style=emptyObj }:TAddAct) => ({
  onClick: useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  }),
  id: `action-add-${type}`,
  key: `action-add-${type}`,
  Icon: Icon || PencilAddIcon,
  label: `Add ${capitalize(type)}`,
  className: `action-add-${type}`,
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
    },
    ...style
  } as CSSProperties
})