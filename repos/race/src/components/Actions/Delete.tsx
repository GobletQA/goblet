import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { SectionActIcnBtn } from '../Section'
import { capitalize } from '@keg-hub/jsutils'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  TrashIcon,
  stopEvent,
  useInline,
} from '@gobletqa/components'


export type TDeleteAct = {
  type:string
  sx?:CSSProperties
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> any
}


const defStyles = {
  [`&:hover`]: {
    color: `var(--goblet-list-errorForeground)`
  },
} as CSSProperties

export const DeleteAct = (props:TDeleteAct) => {
  const { Icon, type, onClick, style, sx } = props

  const ref = `action-remove-${type}`
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
      fontSize={`10px`}
      title={`Remove ${capitalize(type)}`}
    >
      <SectionActIcnBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || TrashIcon}
      />
    </Tooltip>
  )
}
