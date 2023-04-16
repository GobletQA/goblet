import { useMemo } from 'react'
import { FromAlias, FromBrowser, FromStep } from './contextItems'

export const useContextMenu = () => {
  return useMemo(() => {
    return {
      expression: [
        FromBrowser,
        FromAlias,
        FromStep
      ]
    }
  }, [])
}