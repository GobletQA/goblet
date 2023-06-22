import type { TValueGroup, TSetting } from '@types'
import { useMemo } from 'react'
import { emptyObj, exists, get } from '@keg-hub/jsutils'
import { useSettings as useSettingsStore } from '@store'

export const useSettings = <T=TValueGroup>(items:string[], parent:string) => {
  const settings = useSettingsStore()
  
  return useMemo(() => {
    return items.reduce((acc, item) => {
      const loc = parent ? `${parent}.${item}` : item
      const setting = get<TSetting>(settings, loc, emptyObj as TSetting)

      setting.active
        ? (acc[item as keyof T] = setting.value)
        : exists(setting.default) && (acc[item as keyof T] = setting.default)

      return acc
    }, {} as T)

  }, [items, parent, settings])
}