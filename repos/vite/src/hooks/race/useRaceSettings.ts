import type { TSettingAct } from '@types'
import type { TRaceSettings } from '@gobletqa/race'

import { useCallback } from 'react'
import { useSettingValues } from '@hooks/settings/useSettingValues'
import { updateSettingValue } from '@actions/settings/updateSettingValue'

export const useRaceSettings = () => {
  const settings = useSettingValues<TRaceSettings>(`race`)

  const onSettingChange = useCallback((update:TSettingAct) => {
    const key = update.setting as keyof TRaceSettings

    settings[key]
      ? updateSettingValue(update)
      : console.warn(`[Settings Error] Race setting ${key} does not exist, ignoring update`)

  }, [
    settings
  ])

  return {
    settings,
    onSettingChange
  }
}