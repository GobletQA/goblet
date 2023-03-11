import type { TChangeCB, TInputValue } from '@GBC/types'
import type { KeyboardEvent, RefObject, ChangeEvent } from 'react'

import { isStr } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/useInline'
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'

type TInputType = HTMLInputElement | HTMLTextAreaElement | undefined
type TInputEvt = ChangeEvent<TInputType>|KeyboardEvent<TInputType>

export type THInputCallbacks = {
  required?:boolean
  value:TInputValue
  multiple?:boolean
  controlled?:boolean
  onChange?:TChangeCB
  onBlur?:TChangeCB
  onFocus?:TChangeCB
  autoFocus?:boolean
  onKeyDown?:TChangeCB
  setValue?:(value?:TInputValue) => any
  inputRef?: RefObject<TInputType>
}

export const useInputCallbacks = (props:THInputCallbacks) => {

  const {
    value,
    required,
    setValue,
    multiple,
    autoFocus,
    controlled,
  } = props

  const localInputRef = useRef<TInputType>(null)
  const inputRef = useMemo(() => (props.inputRef || localInputRef) as RefObject<TInputType>, [props.inputRef])

  const onBlurIn = useInline(props.onBlur)
  const onFocusIn = useInline(props.onFocus)
  const onChangeIn = useInline(props.onChange)
  const onKeyDownIn = useInline(props.onKeyDown)
  

  const [error, setError] = useState(``)

  const onFocus = useCallback((evt:TInputEvt) => {
    if(!autoFocus || !inputRef.current) return

    inputRef.current?.focus?.()
    inputRef.current?.select?.()
    
    onFocusIn?.(evt)
  }, [
    autoFocus,
    onFocusIn
  ]) 

  const onBlur = useCallback((evt:TInputEvt) => {

    const target = evt?.target as TInputType
    const val = inputRef?.current?.value || target?.value
    error && setError(``)

    if(required && !val)
      setError(`A value is required for this field`)

    if(!onBlurIn) return

    onBlurIn?.(evt, val)
    setValue?.(val || ``)
  }, [
    error,
    value,
    required,
    setValue,
    onBlurIn,
  ])

  const onChange = useCallback((
    evt:ChangeEvent<TInputType>|KeyboardEvent<TInputType>
  ) => {

    const target = evt?.target as TInputType
    const val = inputRef?.current?.value || target?.value
    error && setError(``)

    onChangeIn?.(evt, val)
    setValue?.(val)
  }, [
    error,
    value,
    required,
    setValue,
    onChangeIn,
  ])

  const onKeyDown = useCallback((evt:KeyboardEvent<TInputType>) => {
    const evtKey = evt as Record<`key`, string> 
    const target = evt?.target as TInputType
    const val = target?.value
    error && setError(``)

    if(multiple && evtKey.key === ` `)
      isStr(val) && setValue?.(val.split(` `))

    else if(evtKey.key === `Enter`)
      target?.blur?.()
    
    onKeyDownIn?.(evt)

  }, [
    value,
    error,
    multiple,
    setValue,
    onKeyDownIn
  ])

  useEffect(() => {
    if(controlled) return

    // Update the input value if the prop value has changed
    // This happens when the parent switches the initial prop.value
    // without doing a dom rerender
    inputRef.current
      && props.value !== inputRef.current.value
      && (inputRef.current.value = props.value as any)

  }, [props.value, controlled])


  return {
    error,
    onBlur,
    onFocus,
    setError,
    inputRef,
    onChange,
    onKeyDown,
  }
  
}