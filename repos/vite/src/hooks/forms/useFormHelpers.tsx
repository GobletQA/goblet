import { useState } from 'react'
import { useInline } from '../useInline'
import { noOp, noOpObj } from '@keg-hub/jsutils'

export type THFormHelpers = {
  onSuccess?:(data:any) => any
}

export const useFormHelpers = ({ onSuccess:onSuccessCb=noOp }:THFormHelpers=noOpObj) => {
  
  const onSuccess = useInline(onSuccessCb)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingError, setLoadingError] = useState(``)

  return {
    isLoading,
    onSuccess,
    loadingError,
    setIsLoading,
    setLoadingError
  }
  
}