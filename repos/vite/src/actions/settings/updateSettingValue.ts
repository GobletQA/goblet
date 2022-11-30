import type { TSettingAct } from '@types'

import { exists } from '@keg-hub/jsutils'
import { settingsDispatch } from '@store'

/**
 * Updates a setting value in the store
 * All settings are persisted to local-storage by default
 * Both the data object and the value param do the same thing
 * If data prop has a value key, it will override the value prop
 *
 * @param {string} props.setting - Name of the setting being updated
 * @param {Object} props.data - A partial of the full setting meta data
 * @param {any} props.value - only the value key of the setting meta data
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

  settingsDispatch.update(payload)
}

