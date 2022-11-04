import type { CSSObj } from '@types'

import { noOpObj, ensureArr } from '@keg-hub/jsutils'
import { useMemo } from 'react'

export const useJoinSx = (
  original:CSSObj|CSSObj[]=noOpObj,
  add:CSSObj|CSSObj[]=noOpObj
) => {
  return useMemo(() => {
    return [ ...ensureArr(original), ...ensureArr(add)]
  }, [
    add,
    original,
  ])
}