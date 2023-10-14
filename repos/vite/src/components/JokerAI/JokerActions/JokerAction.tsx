import type { CSSProperties, MouseEvent, ComponentProps } from 'react'
import {
  Button,
} from '@gobletqa/components'

import { EJokerAction } from '@types'
import { 
  JokerActionBtn,
  JokerActionContainer
} from './JokerActions.styled'
import {cls} from '@keg-hub/jsutils'

export type TJokerAction = ComponentProps<typeof Button> & {
  label?:string
  type:EJokerAction
  description?:string
  containerSx?:CSSProperties
  action?:(evt:MouseEvent) => any
}

export const JokerAction = (props:TJokerAction) => {
  
  const {
    type,
    action,
    className,
    label=type,
    text=label,
    description,
    containerSx,
    onClick=action,
    tooltip=description,
    ...rest
  } = props

  return (
    <JokerActionContainer
      sx={containerSx}
      className='gb-joker-action-container'
    >
      <JokerActionBtn
        {...rest}
        text={text}
        tooltip={tooltip}
        onClick={onClick}
        className={cls(className, `gb-joker-action-btn`, `gb-joker-action-${type}`)}
      />
    </JokerActionContainer>
  )
  
}