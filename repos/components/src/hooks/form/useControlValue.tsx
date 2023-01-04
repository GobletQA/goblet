import type { TInputValue } from '@GBC/types'
import { useState, useRef, useEffect } from 'react'

export type THControlValue = {
  value: TInputValue
}

export const useControlValue = (props:THControlValue) => {
  const valueRef = useRef(props.value)
  const [value, setValue] = useState(props.value)
  
  // Watches the prop.value and updates the locally stored state if it has changed
  useEffect(() => {
    if(valueRef?.current === props.value) return

    valueRef.current = props.value
    setValue(props.value)
  }, [props.value])

  return [value, setValue] as [TInputValue, (value:TInputValue) => any]

}