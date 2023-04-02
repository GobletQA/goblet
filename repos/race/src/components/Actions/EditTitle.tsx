import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { capitalize } from '@keg-hub/jsutils'
import { ActionIconBtn }  from '@GBR/components/Actions'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  colors,
  Tooltip,
  stopEvent,
  useInline,
  PencilAddIcon,
  PencilMinusIcon,
} from '@gobletqa/components'


export type TEditTitle = {
  type:string
  label?:string
  editing?:boolean
  sx?:CSSProperties
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

const defStyles = {
  [`&:hover`]: {
    color: colors.purple10
  },
} as CSSProperties

export const EditTitleAct = (props:TEditTitle) => {
  const {
    sx,
    Icon,
    type,
    style,
    editing,
    onClick,
    label=`title`
  } = props

  const ref = `action-edit-${type}`
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  })

  const styles = useActionStyles({ sx, style, styles: defStyles })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Edit ${capitalize(type)} ${label}`}
    >
      <ActionIconBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || (editing ? PencilMinusIcon : PencilAddIcon)}
      />
    </Tooltip>
  )
}
