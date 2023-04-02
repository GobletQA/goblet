// CollapseAllIcon
import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { ActionIconBtn }  from '@GBR/components/Actions'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  CollapseAllIcon,
} from '@gobletqa/components'

export type TCollapseAct = {
  type:string
  sx?:CSSProperties
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick?:(...args:any)=> any
}

const defStyles = {
  [`&:hover`]: {
    color: `var(--goblet-list-warningForeground)`
  },
} as CSSProperties

export const CollapseAct = (props:TCollapseAct) => {
  const { Icon, type, onClick, style, sx } = props

  const ref = `action-collapse-${type}`
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick?.(evt)
  })

  const styles = useActionStyles({ sx, style, styles: defStyles })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Collapse all other sections`}
    >
      <ActionIconBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || CollapseAllIcon}
      />
    </Tooltip>
  )
}
