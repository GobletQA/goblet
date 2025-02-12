import type { ComponentType, MouseEvent, CSSProperties } from 'react'

import { capitalize } from '@keg-hub/jsutils'
import { ActionBtn }  from '@GBR/components/Actions'
import { useActionStyles } from '@GBR/hooks/useActionStyles'
import {
  Tooltip,
  stopEvent,
  useInline,
  PencilAddIcon,
} from '@gobletqa/components'

export type TAddAct = {
  type:string
  disabled?:boolean
  style?:CSSProperties
  Icon?:ComponentType<any>
  onClick: (...args:any)=> void
}

const defStyles = {
  width: `unset`,
  height: `unset`,
  color: `var(--goblet-list-focusForeground)`,
}

export const FeatureAdd = (props:TAddAct) => {
  const {
    Icon,
    type,
    style,
    onClick,
    disabled,
  } = props
  
  const ref = `action-add-${type}`
  const btnClick = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onClick(evt)
  })

  const styles = useActionStyles({ style, styles: defStyles })

  return (
    <Tooltip
      key={ref}
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Add a ${capitalize(type)} section`}
    >
      <ActionBtn
        id={ref}
        key={ref}
        sx={styles}
        className={ref}
        onClick={btnClick}
        disabled={disabled}
        Icon={Icon || PencilAddIcon}
        text={`Add ${capitalize(type)}`}
      />
    </Tooltip>
  )

}
