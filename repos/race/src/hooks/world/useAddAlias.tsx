import type { TWorldConfig } from '@ltipton/parkin'

import { useCallback, useState, useMemo } from 'react'

export type THAddAlias = {
  world:TWorldConfig
}

export const useAddAlias = (props:THAddAlias) => {
  const {
    world
  } = props
  
  const { $alias } = world
  
  const [adding, setAdding] = useState<boolean>(false)
  const [[name, value], setAlias] = useState<string[]>([``, ``])
  const onAddAlias = useCallback(() => setAdding(!adding), [$alias, adding])

  const onDelete = useCallback((name:string) => {
    setAlias([``, ``])
    setAdding(false)
  }, [])

  const onNameChange = useCallback((newName:string) => {
    newName !== name
      && setAlias([newName, value])
  }, [name, value])

  const onValueChange = useCallback((name:string, val:string) => {
    val !== value
      && setAlias([name, val])
  }, [name, value])

  const onSave = useCallback(() => {
    console.log(`------- on save -------`)
    console.log(name, value)
  }, [
    name,
    value
  ])

  const save = useMemo(() => {
    return {
      sx: {
        
      },
      disabled: !Boolean(name.trim() && value.trim())
    }
  }, [
    name,
    value
  ])

  return {
    name,
    save,
    value,
    adding,
    onSave,
    onDelete,
    onAddAlias,
    onNameChange,
    onValueChange,
  }
}

