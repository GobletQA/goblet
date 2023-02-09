import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { SectionActIcnBtn } from '../Section'
import { capitalize } from '@keg-hub/jsutils'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  colors,
  Tooltip,
  stopEvent,
  useInline,
  PlayCircleOutlineIcon,
} from '@gobletqa/components'


export type TPlayAct = {
  type:string
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

export const PlayAct = (props:TPlayAct) => {
  const { Icon, type, onClick, style, sx } = props

  const ref = `action-play-${type}`
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
      title={`Play ${capitalize(type)}`}
    >
      <SectionActIcnBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClk}
        Icon={Icon || PlayCircleOutlineIcon}
      />
    </Tooltip>
  )
}
