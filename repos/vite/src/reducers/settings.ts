import type { TAction, TSettings, TSetting, TSettingAct } from '@types'

import settingsJson from './settings.json'
import { isSetting } from '@utils/store/isSetting'
import { deepMerge, get, set, isObj, noOpObj } from '@keg-hub/jsutils'

export type TSettingsState = TSettings

// Use deepMerge to ensure the settingsState is a unique copy
export const settingsState = deepMerge<TSettingsState>(settingsJson)

const missingSetting = (setting:string) => {
  console.warn(`Tried to update a non-existing setting at path: ${setting}`)
  return noOpObj as any
}

const noSetting = (setting:string) => {
  console.warn(`A setting key name or path string is required. Instead got ${setting}`)
  return noOpObj as any
}

const findSetting = (
  state:TSettingsState,
  action:TAction<TSettingAct>
) => {
  const { setting } = action?.payload

  if(!setting) return noSetting(setting)

  // Get the setting object to be updated, if non exists, the do nothing
  // Only alow pre-defined settings
  const found = get(state, setting)
  if(!isSetting(found)) return missingSetting(setting)

  return { found, setting }

}

export const settingsActions = {
  resetAll: (
    state:TSettingsState,
    action:TAction<any>
  ) => deepMerge(settingsJson),
  mergeAll: (
    state:TSettingsState,
    action:TAction<TSettingsState>
  ) => deepMerge<TSettingsState>(state, action?.payload),
  reset: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    
    const { found, setting } = findSetting(settingsState, action)
    if(!found) return state

    // Use deepMerge to ensure the setting object gets recreated
    set(state, setting, deepMerge<TSetting>(found))

    return state
  },
  toggleActive: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    
    const { found, setting } = findSetting(state, action)
    if(!found) return state

    // If value property is in data, it will override passed in value
    // Use deepMerge to ensure the setting object gets merged and recreated
    const settingObj = deepMerge(found, { active: !found.active })
    set(state, setting, settingObj)

    return state
  },
  update: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    const { found, setting } = findSetting(state, action)
    if(!found) return state

    // If value property is in data, it will override passed in value
    // Use deepMerge to ensure the setting object gets merged and recreated
    const { value, data=noOpObj } = action?.payload
    const settingObj = deepMerge(found, { value, ...data })
    set(state, setting, settingObj)

    return state
  },
}
