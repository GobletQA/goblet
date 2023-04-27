import type { ReactNode, CSSProperties, ComponentType, MouseEvent } from 'react'

import { AliasListActions } from './WorldEditor.styled'
import {
  Span,
  RedText,
  Tooltip,
  useAlert,
  TrashIcon,
  IconButton,
  RestartIcon,
} from '@gobletqa/components'

export type TWorldAliasActions = {
  name?:string
  text?:ReactNode
  sx?:CSSProperties
  onReset?:(evt?:MouseEvent<any>) => void
  onDelete?: (evt?:MouseEvent<any>) => void
}

export type TWorldAliasAction = {
  type:string
  text?:ReactNode
  sx?:CSSProperties
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
  } = props

  return (
    <Tooltip
      loc='top'
      title={text}
      describeChild
      enterDelay={500}
      key={`${type}-action`}
    >
      <IconButton
        Icon={Icon}
        color={color}
        onClick={onClick}
        iconProps={IconProps}
        sx={[styles.button, sx] as CSSProperties[]}
      />
    </Tooltip>
  )
  
}


export const WorldAliasActions = (props:TWorldAliasActions) => {
  const {
    sx,
    name,
    onReset,
    onDelete,
  } = props
 
  const { openAlert } = useAlert({
    onConfirm: () => onDelete?.(),
    props: {
      cancelText: `No`,
      confirmText: `Yes`,
      contentProps: {sx: {marginBottom: `10px`}},
      text: `Are you sure you want to delete this alias?`,
      title: (<Span sx={{ fontWeight: `bold` }} >Delete <RedText>{name}</RedText></Span>),
    }
  })

  return (
    <AliasListActions sx={sx} >
      {/* <AliasAction
        type='reset'
        color={`primary`}
        onClick={onReset}
        Icon={RestartIcon}
        text={`Reset Alias`}
      /> */}
      <AliasAction
        type='delete'
        color={`error`}
        Icon={TrashIcon}
        onClick={openAlert}
        text={`Delete Alias`}
      />
    </AliasListActions>
  )
}