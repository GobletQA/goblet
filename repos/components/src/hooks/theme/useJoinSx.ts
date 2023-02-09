import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { emptyArr, ensureArr } from '@keg-hub/jsutils'

export const useJoinSx = (
  ...styles:(undefined|null|CSSProperties|CSSProperties[])[]
) => {
  return useMemo(() => styles.reduce((joined, style) => ([
    ...ensureArr(joined),
    ...(style ? ensureArr(style) : emptyArr)
  ]), [] as CSSProperties[]), styles)
}