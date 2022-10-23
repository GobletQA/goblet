import type { THFormHelpers, TSetupForm } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { useState, useCallback } from 'react'
import { useBuildForm } from '@hooks/form/useBuildForm'
import { evtFnNoOp } from '@hooks/form/useBuildFormValues'



const formFields = {
  form: {
    name: `repo-form`,
    values: {

    },
  },
  $root: {
    rowSpacing: 2,
    container: true,
    columnSpacing: 1,
    disableEqualOverflow: true
  },
  fields: {
    
  } 
}

export type TRepoForm = THFormHelpers & {
  values?:Record<any, any>
  setupForm?: TSetupForm
  onConnect?: (...args:any[]) => void
}

export const useRepoForm = (props:TRepoForm=noOpObj as TRepoForm) => {
  const [values, setForm] = useState<Record<any, any>>(props.values || {})

  const {
    form,
    loading,
    onSuccess,
    formError,
    setLoading,
    setFormError,
  } = useBuildForm(formFields, {
    ...props,
    values,
    setForm,
    pathValues: {}
  })
  
  return {
    form,
    values,
    loading,
    setForm,
    formError,
    onSuccess,
    setLoading,
    setFormError,
  }

}