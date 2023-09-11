import { useMemo } from 'react'
import { FromAlias, FromBrowser, FromStep, FromFile } from './contextItems'

export const useContextMenu = () => {
  return useMemo(() => {
    return {
      expression: [
        FromBrowser,
        FromAlias,
        FromStep,
        FromFile
      ]
    }
  }, [])
}