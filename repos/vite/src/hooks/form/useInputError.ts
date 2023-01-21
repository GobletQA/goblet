import { useState, useCallback } from 'react'


export type TInputError = Record<string, any>

export const useInputError = <T extends TInputError>() => {
  const [inputError, setInputError] = useState<T>({} as T)
  
  const onInputError = useCallback((
    key:string,
    value?:string
  ) => {
    const copy = { ...inputError }
    if(!value) delete copy[key]
    // Sometimes typescript just doesn't work
    // @ts-ignore
    else copy[key] = value
    

    ;setInputError(copy)
  }, [inputError])
  
  return {
    inputError,
    onInputError,
    setInputError
  }
}
