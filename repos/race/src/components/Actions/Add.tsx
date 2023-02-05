import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { SectionActIcnBtn } from '../Section'
import { capitalize } from '@keg-hub/jsutils'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  colors,
  Tooltip,
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

export const AddAct = (props:TAddAct) => {
  const { Icon, type, onClick, style } = props

  const ref = `action-add-${type}`
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  })

  const styles = useActionStyles({ style })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Add ${capitalize(type)}`}
    >
      <SectionActIcnBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || PencilAddIcon}
      />
    </Tooltip>
  )
}