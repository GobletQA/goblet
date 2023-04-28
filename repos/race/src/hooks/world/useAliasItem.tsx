import type { FocusEventHandler, CSSProperties } from 'react'
import type { TWorldAliasItem } from '@GBR/components/WorldEditor/WorldAliasItem'

import { useCallback, useState } from 'react'
import { useAliasActions } from './useAliasActions'
import {
  Span,
  RedText,
  useAlert,
} from '@gobletqa/components'

export const useAliasItem = (props:TWorldAliasItem) => {

  const {
    name,
    value,
    world,
    noAlert,
  } = props

  const [nameErr, setNameErr] = useState<string>()
  const [valueErr, setValueErr] = useState<string>()

  const onNameChange = useCallback<FocusEventHandler<HTMLInputElement>>((evt) => {
    const updated = evt.target.value.replace(/\$\s-_%\^\&\?\/\\\[\]/g, ``)

    if(!updated?.trim?.()) return setNameErr(`An alias name is required`)
    else if(world.$alias[updated]) return setNameErr(`An alias name is required`)
    else setNameErr(undefined)

    updated !== name
      && props.onNameChange(updated, name)

  }, [
    name,
    world.$alias,
    props.onNameChange,
  ])

  const onValueChange = useCallback<FocusEventHandler<HTMLInputElement>>((evt) => {
    const updated = evt.target.value

    if(!updated?.trim?.()) return setValueErr(`An alias value is required`)
    else setValueErr(undefined)

    // TODO: and proper quotes to value
    updated !== value
      && props.onValueChange(name, updated)

  }, [
    name,
    value,
    world.$alias,
    props.onValueChange,
  ])

  const onDelete = useCallback(() => {
    props?.onDelete?.(name)
  }, [
    name,
    world.$alias,
    props.onDelete
  ])

  const { openAlert } = useAlert({
    onConfirm: onDelete,
    props: {
      cancelText: `No`,
      confirmText: `Yes`,
      contentProps: {sx: {marginBottom: `10px`}},
      text: `Are you sure you want to delete this alias?`,
      title: (<Span sx={{ fontWeight: `bold` }} >Delete <RedText>{name}</RedText></Span>),
    }
  })


  const actions = useAliasActions({...props, onDelete: noAlert ? onDelete : openAlert})

  return {
    actions,
    nameErr,
    valueErr,
    onNameChange,
    onValueChange,
    onDelete: openAlert,
  }
}