import type { TBuildFormObj } from '@types'

import { useEffect } from 'react'
import { noOp, deepMerge } from '@keg-hub/jsutils'

const __Form_Cache = {} as Record<string, TBuildFormObj>

export const evtFnNoOp = noOp as (...args:any[]) => any


export const clearFormCache = (name:keyof typeof __Form_Cache) => {
  delete __Form_Cache[name]
}

export const getCacheForm = (formObj:TBuildFormObj) => {
  const formName = formObj?.form?.name as keyof typeof __Form_Cache
  if(!formName) throw new Error(`Can not build a form with out a name. Missing string at form.form.name`)

  // Sets the form-cache if it does not already exist
  if(!__Form_Cache[formName]) __Form_Cache[formName] = deepMerge(formObj)

  // Returns the form cache object
  // Deep Merge must happen when being set, and not on get
  // Because the cached form object is reused, and must be the same object each time
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
