import { useState, useCallback } from 'react'
import { TRepoInputError } from '@types'

export const useInputError = <T extends TRepoInputError>() => {
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
