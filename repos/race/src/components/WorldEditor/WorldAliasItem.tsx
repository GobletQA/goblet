import type { FocusEventHandler } from 'react'
import type { TWorldConfig } from '@ltipton/parkin'

import {
  AliasListItem,
  AliasNameInput,
  AliasValueInput,
  AliasNameContainer,
  AliasValueContainer,
} from './WorldEditor.styled'

import { useCallback, useState } from 'react'
import { WorldAliasActions } from './WorldAliasActions'

export type TWorldAliasItem = {
  name:string
  value:string
  world:TWorldConfig
  onNameChange:(name:string, oName:string) => void
  onValueChange:(name:string, value:string) => void
}


const useOnChanges = (props:TWorldAliasItem) => {
  
  const {
    name,
    value,
    world,
  } = props

  const [nameErr, setNameErr] = useState<string>()
  const [valueErr, setValueErr] = useState<string>()

  const onNameChange = useCallback<FocusEventHandler<HTMLInputElement>>((evt) => {
    const updated = evt.target.value.replace(/\$\s-_%\^\&\?\/\\\[\]/g, ``)

    if(!updated?.trim?.()) return setNameErr(`An alias name is required`)
    else if(world.$alias[updated]) return setNameErr(`An alias name is required`)
    else setNameErr(undefined)

    updated !== name
      && props.onValueChange(updated, name)

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


  return {
    nameErr,
    valueErr,
    onNameChange,
    onValueChange
  }
}

export const WorldAliasItem = (props:TWorldAliasItem) => {
  const {
    name,
    value
  } = props

  const {
    nameErr,
    valueErr,
    onNameChange,
    onValueChange
  } = useOnChanges(props)

  return (
    <AliasListItem>
      <WorldAliasActions />
      <AliasNameContainer
        className='gb-world-alias-name-container'
      >
        <AliasNameInput
          value={name}
          label={`Name`}
          required={true}
          error={nameErr}
          onBlur={onNameChange}
        />
      </AliasNameContainer>
      <AliasValueContainer
        className='gb-world-alias-value-container'
      >
        <AliasValueInput
          value={value}
          label={`Value`}
          required={true}
          error={valueErr}
          onBlur={onValueChange}
        />
      </AliasValueContainer>
    </AliasListItem>
  )
}