import type { ReactNode, CSSProperties, ComponentType, MouseEvent } from 'react'

import { AliasListActions } from './WorldEditor.styled'
import {
  Span,
  RedText,
  Tooltip,
  useAlert,
  TrashIcon,
  IconButton,
} from '@gobletqa/components'

export type TWorldAliasActions = {
  sx?:CSSProperties
  actions?:TWorldAliasAction[]
}

export type TWorldAliasAction = {
  type:string
  text?:ReactNode
  sx?:CSSProperties
  disabled?:boolean
  Icon?:ComponentType<any>
  onClick?:(evt:any) => void
  color:`inherit` | `default` | `primary` | `secondary` | `error` | `info` | `success` | `warning`
}

const styles = {
  button: {
  },
  icon: {
    margin: 0,
    width: `20px`,
    height: `20px`,
  }
}

const IconProps = {
  sx: styles.icon
}

const AliasAction = (props:TWorldAliasAction) => {
  const {
    sx,
    type,
    Icon,
    text,
    color,
    onClick,
    disabled,
  } = props

  return (
    <Tooltip
      loc='top'
      title={text}
      describeChild
      enterDelay={500}
      key={`${type}-action`}
    >
      <span>
        <IconButton
          Icon={Icon}
          color={color}
          onClick={onClick}
          disabled={disabled}
          iconProps={IconProps}
          sx={[styles.button, sx] as CSSProperties[]}
        />
      </span>
    </Tooltip>
  )
  
}

export const WorldAliasActions = (props:TWorldAliasActions) => {
  const { sx, actions } = props

  return actions && (
    <AliasListActions sx={sx} >
      {actions?.map(action => {
        return (
          <AliasAction
            key={action.type}
            {...action}
          />
        )
      }) || null}
    </AliasListActions>
  ) || null
}