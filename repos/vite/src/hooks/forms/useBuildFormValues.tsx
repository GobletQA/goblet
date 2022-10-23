import type {
  TFormActions,
  TBuildFormObj,
  TBuildFormOpts,
} from '@types'

import { useMemo } from 'react'
import { noOp } from '@keg-hub/jsutils'

export const evtFnNoOp = noOp as (...args:any[]) => any

export const useBuildFormValues = (
  formObj:TBuildFormObj,
  options:TBuildFormOpts
) => {
  const { values } = options

  return useMemo(() => {
    return Object.assign({}, formObj.fields, {
      form: {
        values: {
          ...formObj.form.values,
          ...values
        },
      },
      $root: formObj.$root || noOp,
      $actions: (formObj.$actions || noOp) as TFormActions
    })
  }, [formObj, values])
}

