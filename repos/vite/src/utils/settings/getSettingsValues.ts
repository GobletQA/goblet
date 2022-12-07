import type { TValueGroup, TSetting, TSettings } from '@types'

import { getStore } from '@store'
import { get, set, noOpObj, exists } from '@keg-hub/jsutils'

/**
 * Helper to extract the values from a settings object and match it to the key
 * Creates a key value pair removing the meta-data
 */
export const getSettingsValues = <T extends TValueGroup>(loc:string, settings?:TSettings):T => {
  settings = settings || getStore().getState().settings
  const group = get(settings, loc, noOpObj)

  const mapped = Object.entries(group)
    .reduce((acc, [key, settingObj]:[string, TSetting]) => {
      const ref = settingObj?.key || key

      settingObj.active
        ? set(acc, ref, settingObj?.value)
        : exists(settingObj.default) && set(acc, ref, settingObj?.default)

      return acc
    }, {} as T)

  return mapped
}