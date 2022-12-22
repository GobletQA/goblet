import type {
  TAction,
  TSetting,
  TSettings,
  TSettingAct,
  TStorageSetting
} from '@types'

import settingsJson from './settings.json'
import { localStorage } from '@services/localStorage'
import { findSetting } from '@utils/settings/findSetting'
import { ScreencastWidth, ScreencastHeight } from '@constants/screencast'
import { deepMerge, set, get, noOpObj, exists, pickKeys } from '@keg-hub/jsutils'

const defSettings = deepMerge(settingsJson, {
  browser: {
    width: {
      value: ScreencastWidth,
      default: ScreencastWidth,
    },
    height: {
      value: ScreencastHeight,
      default: ScreencastHeight,
    }
  }
})

export type TSettingsState = TSettings

// Use deepMerge to ensure the settingsState is a unique copy
export const settingsState = deepMerge<TSettingsState>(defSettings)

const updateStorage = (setting:string, settingObj:TSetting) => {
  /**
   * No need to await the local storage call
   * We do no depend on the value being set
   */
  localStorage.setSetting(
    setting,
    pickKeys<TStorageSetting>(settingObj, [`value`, `active`, `group`])
  )
}

export const settingsActions = {
  setAllSettings: (
    state:TSettingsState,
    action:TAction<TSettingsState>
  ) => action.payload,
  resetAllSettings: (
    state:TSettingsState,
    action:TAction<any>
  ) => {
    localStorage.removeSettings()
    return deepMerge(defSettings)
  },
  mergeAllSettings: (
    state:TSettingsState,
    action:TAction<TSettingsState>
  ) => deepMerge<TSettingsState>(state, action?.payload),
  resetSettingGroup: (
    state:TSettingsState,
    action:TAction<string>
  ) => {
    const group = action.payload
    if(!group) return state
    
    localStorage.removeSettingGroup(group)
    set(state, group, get(defSettings, group))
    
    return state
  },
  resetSetting: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    
    const { found, setting } = findSetting(action.payload?.setting, defSettings)
    localStorage.removeSetting(setting)
    found && set(state, setting, deepMerge<TSetting>(found))

    return state
  },
  toggleSettingActive: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    
    const { data } = action.payload
    const { found, setting } = findSetting(action.payload?.setting, state)
    if(!found) return state

    // Use the data.active value or the inverse of current active if no data
    const active = exists(data?.active) ? data?.active : !found.active

    // Use deepMerge to ensure the setting object gets merged and recreated
    const settingObj = deepMerge(found, { active })
    set(state, setting, settingObj)
    updateStorage(setting, settingObj)

    return state
  },
  updateSetting: (
    state:TSettingsState,
    action:TAction<TSettingAct>
  ) => {
    const { found, setting } = findSetting(action.payload?.setting, state)
    if(!found) return state

    /**
     * If value property is in data, it will override passed in value
     * Use deepMerge to ensure the setting object gets merged and recreated
     */
    const { value, data=noOpObj } = action?.payload
    const settingObj = deepMerge(found, { value, ...data })
    set(state, setting, settingObj)
    updateStorage(setting, settingObj)

    return state
  },
}
