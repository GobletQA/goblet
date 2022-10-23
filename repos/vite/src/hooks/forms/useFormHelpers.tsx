import type { THFormHelpers, THFormHelpersResp } from '@types'

import { useState } from 'react'
import { useInline } from '../useInline'
import { noOp, noOpObj } from '@keg-hub/jsutils'

export const useFormHelpers = ({
  onSuccess:onSuccessCb=noOp,
}:THFormHelpers=noOpObj):THFormHelpersResp => {

  const onSuccess = useInline(onSuccessCb)
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<string>(``)

  return {
    loading,
    onSuccess,
    formError,
    setLoading,
    setFormError,
  }
}