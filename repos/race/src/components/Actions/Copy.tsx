import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { capitalize } from '@keg-hub/jsutils'
import { ActionIconBtn }  from '@GBR/components/Actions'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  ContentCopyIcon,
} from '@gobletqa/components'


export type TCopyAct = {
  type:string
  sx?:CSSProperties
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

export const CopyAct = (props:TCopyAct) => {
  const { Icon, type, onClick, style, sx } = props

  const ref = `action-copy-${type}`
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  })

  const styles = useActionStyles({ sx, style })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Copy ${capitalize(type)}`}
    >
      <ActionIconBtn
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
