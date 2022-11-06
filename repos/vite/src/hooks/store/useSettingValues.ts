import type { TValueGroup, TSetting } from '@types'

import { useSettings } from '@store'
import { get, noOpObj } from '@keg-hub/jsutils'


/**
 * Helper to extract the values from a settings object and match it to the key
 * Creates a key value pair removing the meta-data
 */
export const useSettingValues = <T extends TValueGroup>(loc:string):T => {
  const settings = useSettings()
  const group = get(settings, loc, noOpObj)

  return Object.entries(group)
    .reduce((acc, [key, settingObj]:[string, TSetting]) => {
      settingObj.active && (acc[key as keyof T] = settingObj?.value)

      return acc
    }, {} as T)
}