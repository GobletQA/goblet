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
  onToggleEdit?:TToggleEditCB
  setValue?:(value:TInputValue) => any
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
    value,
    setValue,
    required,
    multiple,
    controlled,
    initialEditing=false,
    valueProp=`value` as keyof T,
  } = props

  const inputRef = useRef<T>(null)
  const onChangeCB = useInline(props.onChange)
  const onToggleEditCB = useInline(props.onToggleEdit)
  const [editing, setEditing] = useState<boolean>(initialEditing)

  const [error, setError] = useState(``)

  const onToggleEdit = useCallback((
    evt?:ChangeEvent<T>|KeyboardEvent<T>|MouseEvent<HTMLDivElement>
  ) => {

    const update = !editing
    const value = getValue(inputRef, valueProp)
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
    setValue?.(val)
  }, [
    error,
    value,
    setValue,
    valueProp,
    onChangeCB,
  ])

  const onKeyDown = useCallback((evt:KeyboardEvent<T>) => {
    if(!editing) return
    
    const evtKey = evt as Record<`key`, string> 
    evtKey.key === `Enter` && onToggleEdit(evt)
    if(multiple && evtKey.key === ` `){
      const val = getValue(inputRef, valueProp)
      isStr(val) && setValue?.(val.split(` `))

      console.log(`------- val -------`)
      console.log(val)
    }
    
  }, [
    editing,
    multiple,
    setValue,
    valueProp,
    onToggleEdit
  ])

  const onClick = useCallback((evt:MouseEvent<HTMLDivElement>) => {
    !editing && evt.detail == 1 && onToggleEdit(evt)
  }, [editing, onToggleEdit])
  

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
    editing
      && setTimeout(() => {
          const input = inputRef?.current as HTMLInputElement
          input?.focus?.()
          input?.select?.()
        }, 100)
  })


  return {
    error,
    editing,
    onClick,
    setError,
    inputRef,
    onChange,
    onKeyDown,
    onToggleEdit,
  }
  
}