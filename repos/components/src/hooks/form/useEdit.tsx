import type { RefObject, ChangeEvent } from 'react'

import { exists, isStr } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/useInline'
import { useState, useCallback, useRef } from 'react'

export type THEdit<T> = {
  required?:boolean
  valueProp?:keyof T
  initialEditing?:boolean
  value:string|boolean|number
  onToggleEdit?:(evt:ChangeEvent<T>, value:boolean) => void
  onChange?:(evt:ChangeEvent<T>, value:string|boolean|number) => void
}

const getValue = <T=any>(inputRef:RefObject<T>, valueProp:keyof T) => {
  return (inputRef?.current as T)?.[valueProp as keyof T] as string|boolean|number
}

const isRequired = (
  value: string|boolean|number,
  editing:boolean,
  required?:boolean,
) => {
  return editing &&
    required &&
    (!exists(value) || (!isStr(value) || !value?.length))
}

export const useEdit = <T=any>(props:THEdit<T>) => {

  const {
    required,
    initialEditing=false,
    valueProp=`value` as keyof T,
  } = props

  const inputRef = useRef<T>(null)
  const onChangeCB = useInline(props.onChange)
  const onToggleEditCB = useInline(props.onToggleEdit)
  const [editing, setEditing] = useState<boolean>(initialEditing)

  const [error, setError] = useState(``)
  const [value, setValue] = useState(props.value)

  const onToggleEdit = useCallback((evt:ChangeEvent<T>) => {
    const update = !editing

    const requiredVal = isRequired(getValue(inputRef, valueProp), editing, required)
    if(requiredVal) return setError(`Field is required`)

    onToggleEditCB?.(evt, update)
    setEditing(update)

  }, [
    editing,
    required,
    valueProp,
    onToggleEditCB
  ])

  const onChange = useCallback((evt:ChangeEvent<T>) => {
    const val = getValue(inputRef, valueProp)
    val !== value
      && error
      && setError(``)

    onChangeCB?.(evt, val)
    setValue(val)
  }, [
    error,
    setValue,
    valueProp,
    onChangeCB,
  ])

  return {
    value,
    error,
    editing,
    setError,
    inputRef,
    onChange,
    onToggleEdit,
  }
  
}