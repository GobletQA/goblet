import type { TSettingAct } from '@types'

import { exists } from '@keg-hub/jsutils'
import { settingsDispatch } from '@store'
import { SettingSidebarLocked } from '@constants/settings'
import { toggleSidebarLocked } from '../nav/toggleSidebarLocked'

const settingActions:Record<string, (payload:TSettingAct) => void> = {
  [SettingSidebarLocked]: (payload:TSettingAct) => toggleSidebarLocked(payload.value)
  // Add other setting actions here as needed
}

/**
 * Updates a setting value in the store
 * All settings are persisted to local-storage by default
 * Both the data object and the value param do the same thing
 * If data prop has a value key, it will override the value prop
 *
 */
export const updateSettingValue = (props:TSettingAct) => {
  const {
    data,
    value,
    setting,
  } = props

  const payload:TSettingAct = { setting }
  exists(value) && (payload.value = value)
  ;data && (payload.data = data)

  // Call the setting action if it exists
  settingActions?.[setting]?.(payload)

  settingsDispatch.updateSetting(payload)
}

