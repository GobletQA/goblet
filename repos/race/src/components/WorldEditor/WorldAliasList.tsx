import type { TOnWorldChange } from '@GBR/types'
import type { TWorldConfig } from '@ltipton/parkin'

import { AddAliasAction } from './AddAliasAction'
import { WorldAliasListHeader } from './WorldAliasListHeader'
import { AliasList, AliasListContainer } from './WorldEditor.styled'

import { WorldAliasItem } from './WorldAliasItem'

import { useMemo, useCallback } from 'react'

type TAliasItem = {
  name:string
  value:string
}

export type TWorldAliasList = {
  world:TWorldConfig
  onChange:TOnWorldChange
}


const useAliasList = (props:TWorldAliasList) => {
  const {
    world
  } = props
  const { $alias } = world

  return useMemo<TAliasItem[]>(() => {
    return Object.entries($alias as Record<string, string>)
      .map(([name, value]) => ({ name, value }))
  }, [$alias])
}

const useOnNameChange = (props:TWorldAliasList) => {
  const {
    world,
    onChange
  } = props

  return useCallback((name:string, oName:string) => {
    const updated = {...world.$alias}
    const value = updated[oName]
    delete updated[oName]

    updated[name] = value
    
    onChange({world: {...world, [`$alias`]: updated }, replace: true})

  }, [world.$alias,  onChange])
}

const useOnValueChange = (props:TWorldAliasList) => {
  const {
    world,
    onChange
  } = props

  return useCallback((key:string, value:string) => {
    const updated = {...world.$alias}
    updated[key] = value

    onChange({world: {...world, [`$alias`]: updated }, replace: true})
  }, [world.$alias, onChange])
}

const useOnDelete = (props:TWorldAliasList) => {
  const {
    world,
    onChange
  } = props

  return useCallback((name:string) => {
    const updated = {...world.$alias}
    delete updated[name]

    onChange({world: {...world, [`$alias`]: updated }, replace: true})
  }, [world.$alias, onChange])
}


export const WorldAliasList = (props:TWorldAliasList) => {
  const {
     world
  } = props

  const list = useAliasList(props)
  const onDelete = useOnDelete(props)
  const onNameChange = useOnNameChange(props)
  const onValueChange = useOnValueChange(props)

  return (
    <AliasListContainer className='gb-world-alias-container' >
      <AliasList className='gb-world-alias-list' >
        <WorldAliasListHeader />

        {list?.length && list.map(item => {
          return (
            <WorldAliasItem
              {...item}
              world={world}
              onDelete={onDelete}
              onNameChange={onNameChange}
              onValueChange={onValueChange}
              key={`${item.name}-${item.value}`}
            />
          )
        })}
      </AliasList>
      <AddAliasAction world={world} />
    </AliasListContainer>
  )
}