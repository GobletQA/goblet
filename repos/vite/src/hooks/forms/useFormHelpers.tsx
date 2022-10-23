import type { Dispatch, SetStateAction } from 'react'

import { useState } from 'react'
import { useInline } from '../useInline'
import { noOp, noOpObj } from '@keg-hub/jsutils'

export type THFormHelpers = {
  onSuccess?:(data:any) => any
}

export type THFormHelpersResp = {
  isLoading:boolean
  loadingError: string
  onSuccess: (...args:any[]) => any,
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setLoadingError: Dispatch<SetStateAction<string>>
}

export const useFormHelpers = ({
  onSuccess:onSuccessCb=noOp,
}:THFormHelpers=noOpObj):THFormHelpersResp => {

  const onSuccess = useInline(onSuccessCb)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingError, setLoadingError] = useState<string>(``)

  return {
    isLoading,
    onSuccess,
    loadingError,
    setIsLoading,
    setLoadingError,
  }
}