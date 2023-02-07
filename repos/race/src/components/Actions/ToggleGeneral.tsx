import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { SectionActIcnBtn } from '../Section'
import { useSettings } from '@GBR/contexts'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  NoteMinusIcon,
} from '@gobletqa/components'

export type TToggleGeneralAct = {
  style?:CSSProperties
  Icon?:ComponentType<any>
}

const defStyles = {
  [`&:hover`]: {
    color: `var(--goblet-list-errorForeground)`
  },
} as CSSProperties

export const ToggleGeneralAct = (props:TToggleGeneralAct) => {
  const { Icon, style } = props
  const { toggleGeneral } = useSettings()
  const ref = `action-toggle-general`
  
  const btnClk = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    toggleGeneral()
  })

  const styles = useActionStyles({ style, styles: defStyles })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Hide General`}
    >
      <SectionActIcnBtn
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
