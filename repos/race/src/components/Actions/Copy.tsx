import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { SectionActIcnBtn } from '../Section'
import { capitalize } from '@keg-hub/jsutils'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  ContentCopyIcon,
} from '@gobletqa/components'


export type TCopyAct = {
  type:string
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

export const CopyAct = (props:TCopyAct) => {
  const { Icon, type, onClick, style } = props

  const ref = `action-copy-${type}`
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
      title={`Copy ${capitalize(type)}`}
    >
      <SectionActIcnBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || ContentCopyIcon}
      />
    </Tooltip>
  )
}
