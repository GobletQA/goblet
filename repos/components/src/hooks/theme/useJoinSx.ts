import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { useInline } from '@GBC/hooks/useInline'
import { emptyArr, ensureArr } from '@keg-hub/jsutils'

export const useJoinSx = (
  ...styles:(undefined|null|CSSProperties|CSSProperties[])[]
) => {
  
  const joinSx = useInline(() => styles.reduce((joined, style) => ([
    ...ensureArr(joined),
    ...(style ? ensureArr(style) : emptyArr)
  ]), [] as CSSProperties[]))
  
  return useMemo(() => joinSx(), [joinSx])
}