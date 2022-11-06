import type { TAction, TSettings, TSetting, TSettingAct } from '@types'

import settingsJson from './settings.json'
import { isSetting } from '@utils/store/isSetting'
import { deepMerge, get, set, isObj, noOpObj } from '@keg-hub/jsutils'

export type TSettingsState = TSettings

// Use deepMerge to ensure the settingsState is a unique copy
export const settingsState = deepMerge<TSettingsState>(settingsJson)

const missingSetting = (state:TSettingsState, setting:string) => {
  console.warn(`Tried to update a non-existing setting at path: ${setting}`)
  return state
}

const noSetting = (state:TSettingsState, setting:string) => {
  console.warn(`A setting key name or path string is required. Instead got ${setting}`)
  return state
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
    const { setting } = action?.payload
    if(!setting) return noSetting(state, setting)

    // Get the setting from the original setting state
    // Which we can then use to reset the setting state
    const defSetting = get(settingsState, setting)
    if(!isSetting(defSetting)) missingSetting(state, setting)

    // Create a new state object, to ensure an update
    const updated = { ...state }

    // Use deepMerge to ensure the setting object gets recreated
    set(updated, setting, deepMerge<TSetting>(defSetting))

    return updated
  },
  update: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    const { setting, value, data=noOpObj } = action?.payload
    if(!setting) return noSetting(state, setting)

    // Get the setting object to be updated, if non exists, the do nothing
    // Only alow pre-defined settings
    const foundSetting = get(state, setting)
    if(!isSetting(foundSetting)) missingSetting(state, setting)

    // Create a new state object, to ensure an update
    const updated = { ...state }

    // If value property is in data, it will override passed in value
    // Use deepMerge to ensure the setting object gets merged and recreated
    const settingObj = deepMerge(foundSetting, { value, ...data })

    set(updated, setting, settingObj)

    return updated
  },
}
