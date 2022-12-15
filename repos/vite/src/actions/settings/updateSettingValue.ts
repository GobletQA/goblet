import type { TSettingAct } from '@types'

import { exists } from '@keg-hub/jsutils'
import { settingsDispatch } from '@store'

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

  settingsDispatch.updateSetting(payload)
}

