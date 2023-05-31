import type { CSSProperties } from 'react'

import { noOpObj, ensureArr } from '@keg-hub/jsutils'
import { useMemo } from 'react'

export const useJoinSx = (
  original:CSSProperties|CSSProperties[]=noOpObj,
  add:CSSProperties|CSSProperties[]=noOpObj
) => {
  return useMemo(() => {
    return [ ...ensureArr(original), ...ensureArr(add)]
  }, [
    add,
    original,
  ])
}