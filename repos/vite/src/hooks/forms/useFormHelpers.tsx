import type { THFormHelpers, THFormHelpersResp } from '@types'

import { useState } from 'react'
import { useInline } from '../useInline'
import { noOp, noOpObj } from '@keg-hub/jsutils'

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