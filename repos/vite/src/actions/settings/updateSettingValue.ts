import type { TSettingAct } from '@types'

import { exists } from '@keg-hub/jsutils'
import { settingsDispatch } from '@store'
import { toggleSidebarLocked } from '../nav/toggleSidebarLocked'
import { toggleMultiFeatsErr } from '../features/local/toggleMultiFeatsErr'
import {
  SettingMultiFeatsErr,
  SettingSidebarLocked,
} from '@constants/settings'

const settingActions:Record<string, (payload:TSettingAct) => void> = {
  [SettingMultiFeatsErr]: (payload:TSettingAct) => toggleMultiFeatsErr(payload.value),
  [SettingSidebarLocked]: (payload:TSettingAct) => toggleSidebarLocked(payload.value),
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

