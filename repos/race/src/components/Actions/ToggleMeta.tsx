import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { useSettings } from '@GBR/contexts'
import { ActionIconBtn }  from '@GBR/components/Actions'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  NoteMinusIcon,
} from '@gobletqa/components'

export type TToggleMetaAct = {
  style?:CSSProperties
  Icon?:ComponentType<any>
}

const defStyles = {
  [`&:hover`]: {
    color: `var(--goblet-list-errorForeground)`
  },
} as CSSProperties

export const ToggleMetaAct = (props:TToggleMetaAct) => {
  const { Icon, style } = props
  const { toggleMeta } = useSettings()
  const ref = `action-toggle-general`
  
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    toggleMeta()
  })

  const styles = useActionStyles({ style, styles: defStyles })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Hide Meta`}
    >
      <ActionIconBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || NoteMinusIcon}
      />
    </Tooltip>
  )
}
