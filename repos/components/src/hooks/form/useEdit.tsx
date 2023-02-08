import type { TToggleEditCB, TChangeCB, TInputValue } from '@GBC/types'
import type { KeyboardEvent, RefObject, ChangeEvent, MouseEvent } from 'react'


import { exists, isStr } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/useInline'
import { useEffectOnce } from '@GBC/hooks/useEffectOnce'
import { useState, useCallback, useRef, useEffect } from 'react'

export type THEdit<T> = {
  required?:boolean
  value:TInputValue
  valueProp?:keyof T
  multiple?:boolean
  controlled?:boolean
  onChange?:TChangeCB
  initialEditing?:boolean
  setValue?:(value:TInputValue) => any
}

const getValue = <T=any>(inputRef:RefObject<T>, valueProp:keyof T) => {
  return (inputRef?.current as T)?.[valueProp as keyof T] as string|boolean|number
}

export const useEdit = <T=any>(props:THEdit<T>) => {

  const {
    value,
    required,
    setValue,
    multiple,
    controlled,
    initialEditing,
    valueProp=`value` as keyof T,
  } = props

  const inputRef = useRef<T>(null)
  const onChangeCB = useInline(props.onChange)

  const [error, setError] = useState(``)

  const onBlur = useCallback((evt:ChangeEvent<T>|KeyboardEvent<T>) => {
    const val = getValue(inputRef, valueProp)
    val !== value
      && error
      && setError(``)

    if(required && !val)
      return setError(`A value is required for this field`)

    onChangeCB?.(evt, val)
    setValue?.(val)
  }, [
    error,
    value,
    required,
    setValue,
    valueProp,
    onChangeCB,
  ])

  const onKeyDown = useCallback((evt:KeyboardEvent<T>) => {
    const evtKey = evt as Record<`key`, string> 
    const target = evt?.target as HTMLInputElement
    const val = target?.value
    if(multiple && evtKey.key === ` `)
      return isStr(val) && setValue?.(val.split(` `))

    evtKey.key === `Enter` && target?.blur?.()
  }, [
    multiple,
    setValue,
    valueProp,
  ])

  useEffect(() => {
    if(controlled) return

    // Update the input value if the prop value has changed
    // This happens when the parent switches the initial prop.value
    // without doing a dom rerender
    inputRef.current
    && props.value !== inputRef.current[valueProp]
      && (inputRef.current[valueProp as keyof T] = props.value as any)

  }, [props.value, controlled])


  // Auto select the input if the initial load is set to editing
  useEffectOnce(() => {
    initialEditing
      && setTimeout(() => {
          const input = inputRef?.current as HTMLInputElement
          input?.focus?.()
          input?.select?.()
        }, 100)
  })


  return {
    error,
    onBlur,
    setError,
    inputRef,
    // onChange,
    onKeyDown,
  }
  
}