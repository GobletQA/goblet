import type { ComponentMap } from './Register'

import { useState, useRef } from 'react'
import { useInline } from '../useInline'
import { noOp, noOpObj } from '@keg-hub/jsutils'


export type THFormHelpers = {
  components?:ComponentMap,
  onSuccess?:(data:any) => any
}

export const useFormHelpers = ({
  components,
  onSuccess:onSuccessCb=noOp,
}:THFormHelpers=noOpObj) => {
  
  const onSuccess = useInline(onSuccessCb)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingError, setLoadingError] = useState(``)

  return {
    isLoading,
    onSuccess,
    loadingError,
    setIsLoading,
    setLoadingError,
  }
  
}