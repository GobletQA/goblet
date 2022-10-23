import type { TBuildFormObj } from '@types'

import { useEffect } from 'react'
import { noOp, deepMerge } from '@keg-hub/jsutils'

const __Form_Cache = {} as Record<string, TBuildFormObj>

export const evtFnNoOp = noOp as (...args:any[]) => any

export const getCacheForm = (formObj:TBuildFormObj) => {
  const formName = formObj?.form?.name as keyof typeof __Form_Cache
  if(!formName) throw new Error(`Can not build a form with out a name. Missing string at form.form.name`)

  if(!__Form_Cache[formName]) __Form_Cache[formName] = deepMerge(formObj)

  return __Form_Cache[formName]
}

export const useClearFormCache = (form:TBuildFormObj) => {
  // Ensure the original from is added to cache
  // And add the mount handler to clean up the cache
  useEffect(() => {
    getCacheForm(form)
    
    return () => {
      delete __Form_Cache[form.form.name]
    }
  }, [])
}
