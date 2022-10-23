import type {
  TBuiltForm,
  TBuildFormObj,
  TBuildFormOpts,
} from '@types'

import { useMemo } from 'react'
import { useFormHelpers } from './useFormHelpers'
import { useBuildFormValues } from './useBuildFormValues'
import { getCacheForm, useClearFormCache } from './FormCache'
import { useHardReplace, useDynReplace  } from './useReplace'

export const useBuildForm = (
  formObj:TBuildFormObj,
  options:TBuildFormOpts
) => {

  const { values } = options
  const originalForm = getCacheForm(formObj)

  const valuesForm:TBuiltForm = useBuildFormValues(formObj, options)
  const pathForm:TBuiltForm = useHardReplace(valuesForm, options)
  
  const actionsForm:TBuiltForm = useDynReplace(pathForm, options, originalForm.$actions, `$actions`)
  const form:TBuiltForm = useDynReplace(actionsForm, options, originalForm.fields)

  const formHelpers = useFormHelpers(options)

  useClearFormCache(originalForm)

  return {
    form,
    ...formHelpers,
  }

}