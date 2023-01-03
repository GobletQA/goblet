import type { TToggleEditCB, TChangeCB } from '@GBC/types'
import type { KeyboardEvent, RefObject, ChangeEvent } from 'react'


import { exists, isStr } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/useInline'
import { useState, useCallback, useRef } from 'react'

export type THEdit<T> = {
  required?:boolean
  valueProp?:keyof T
  initialEditing?:boolean
  value:string|boolean|number
  onChange?:TChangeCB
  onToggleEdit?:TToggleEditCB
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

  const onToggleEdit = useCallback((evt?:ChangeEvent<T>|KeyboardEvent<T>) => {

    const update = !editing
    const requiredVal = isRequired(getValue(inputRef, valueProp), editing, required)
    if(requiredVal) return setError(`Field is required`)

    onToggleEditCB?.(evt, value, update)
    setEditing(update)

    // Must be called after the setEditing call, so the input is no longer disabled
    update
      && setTimeout(() => {
        const input = inputRef?.current as HTMLInputElement
        input?.focus?.()
        input?.select?.()
      }, 100)

  }, [
    value,
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

  const onKeyDown = useCallback((evt:KeyboardEvent<T>) => {
    ;(evt as any).key === `Enter` && onToggleEdit(evt)
  }, [onToggleEdit])

  return {
    value,
    error,
    editing,
    setError,
    inputRef,
    onChange,
    onKeyDown,
    onToggleEdit,
  }
  
}