import type { TValueGroup, TSetting, TSettings } from '@types'

import { getStore } from '@store'
import { isSetting } from '@utils/settings/isSetting'
import { get, noOpObj } from '@keg-hub/jsutils'

const missingSetting = (setting:string) => {
  console.warn(`Tried to update a non-existing setting at path: ${setting}`)
  return noOpObj as any
}

const noSetting = (setting:string) => {
  console.warn(`A setting key name or path string is required. Instead got ${setting}`)
  return noOpObj as any
}

export const findSetting = (
  setting:string,
  settings?:TSettings
) => {

  if(!setting) return noSetting(setting)

  settings = settings || getStore?.()?.getState?.()?.settings

  const found = get(settings, setting, noOpObj)
  
  return !isSetting(found)
    ? missingSetting(setting)
    : { found, setting }

}
