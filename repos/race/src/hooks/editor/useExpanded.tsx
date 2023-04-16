import { useState, useCallback } from 'react'
import { exists, ensureArr } from '@keg-hub/jsutils'

export type TExpanded = Record<string, boolean>

export const useExpanded = () => {
  const [expanded, setExpanded] = useState<TExpanded>({})

  const updateExpanded = useCallback((key:string, value?:boolean) => {
    const val = exists<boolean>(value)
      ? value
      : exists<boolean>(expanded[key])
        ? !expanded[key]
        : true

    setExpanded({...expanded, [key]: val})
  }, [expanded])

  const collapseAllExcept = useCallback((key:string|string[]) => {
    const keep = ensureArr(key)
    const updated:TExpanded = {}

    Object.keys(expanded).forEach(key => (updated[key] = keep.includes(key) ? true : false))

    setExpanded(updated)
  }, [expanded])
  
  const collapseAll = useCallback(() => setExpanded({}), [expanded])

  return {
    expanded,
    setExpanded,
    collapseAll,
    updateExpanded,
    collapseAllExcept
  }
}
