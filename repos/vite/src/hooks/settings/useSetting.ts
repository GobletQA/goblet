import { useMemo } from 'react'
import { useSettings } from '@store'
import { get } from '@keg-hub/jsutils'

export const useSetting = (loc:string) => {
  const settings = useSettings()
  return useMemo(() => {
    const path = loc.endsWith(`.value`) ? loc : `${loc}.value`
    return get(settings, path)
  }, [loc, settings])
}